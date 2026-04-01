import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class HnHiringScraper extends BaseScraper {
  // Direct March 2026 HN "Who is Hiring" thread ID: 47219668
  private readonly threadId = '47219668';
  private readonly url = `https://news.ycombinator.com/item?id=${this.threadId}`;

  private readonly userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (AppleChromebook; MacOS; Macintosh; Chrome/121.0.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  ];

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getHeaders(): any {
    return {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://news.ycombinator.com/'
    };
  }

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs directly from HN Thread: ${this.url}...`);

    try {
      const response = await axios.get(this.url, {
        headers: this.getHeaders(),
        validateStatus: () => true 
      });

      this.logger.log(`Response status from HackerNews: ${response.status}`);
      if (response.status !== 200) {
        this.logger.error(`Failed to fetch HN thread. Status: ${response.status}`);
        return [];
      }
      
      const data = response.data;
      const $ = cheerio.load(data);
      const jobs: CreateStartupDto[] = [];
      const comments = $('.athing.comtr').toArray();
      
      this.logger.log(`Found ${comments.length} total comments on the page.`);
      
      for (const el of comments) {
        // Only top-level comments are job posts
        // Indentation image width determines nesting level (0 for top-level)
        const indentImg = $(el).find('img[src="s.gif"]');
        const indentWidth = indentImg ? parseInt(indentImg.attr('width') || '0', 10) : 0;
        
        if (indentWidth > 0) continue; // Skip nested replies

        const commText = $(el).find('.commtext');
        if (!commText.length) continue;

        // Clean up the text: remove "reply" and other buttons
        commText.find('.reply').remove();
        const fullText = commText.text().trim();
        if (!fullText) continue;

        // The first line usually contains "Company | Role | Location | Remote"
        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 1) continue;

        const firstLine = lines[0];
        const lowerFirstLine = firstLine.toLowerCase();

        // Very basic filter: if first line doesn't contain common hiring words, it might not be a job post
        // (Though usually top-level comments in this thread ARE job posts)
        const isJobPost = lowerFirstLine.includes('|') || 
                          lowerFirstLine.includes('hiring') || 
                          lowerFirstLine.includes('remote') || 
                          lowerFirstLine.includes('engineer');
        
        if (!isJobPost && lines.length < 3) continue;

        // Extraction
        const parts = firstLine.split('|').map(p => p.trim());
        let name = parts[0] || 'Unknown Startup';
        let role = parts[1] || 'Software Engineer';
        let location = parts[2] || 'Check post';

        // Limit name length
        if (name.length > 100) name = name.substring(0, 100);

        // Find links
        const links = commText.find('a').map((_, a) => $(a).attr('href')).get();
        let careersUrl = links.find(l => 
            l && (
              l.includes('greenhouse.io') || 
              l.includes('lever.co') || 
              l.includes('workable.com') || 
              l.includes('ashbyhq.com') ||
              l.includes('apply') ||
              l.includes('careers') ||
              l.includes('jobs')
            )
        );

        if (!careersUrl && links.length > 0) {
            careersUrl = links.find(l => l && l.includes('http') && !l.includes('ycombinator.com'));
        }

        const startup: CreateStartupDto = {
          name: name,
          websiteUrl: careersUrl || '',
          careersUrl: careersUrl || '',
          shortDescription: fullText.substring(0, 500) + '...',
          industry: 'Tech',
          location: location,
          hiringScore: 0,
          growthScore: 0,
          remoteScore: lowerFirstLine.includes('remote') ? 10 : 5,
          jobTitle: role,
          aiSummary: `Source: Direct HN. Position: ${role}`,
          batch: 'HN-Direct',
          source: 'HN Hiring'
        };

        const scored = this.generateScores(startup) as CreateStartupDto;
        jobs.push(scored);

        if (jobs.length >= 40) break; // Limit per scrape
      }

      this.logger.log(`Found ${jobs.length} valid jobs from Direct HN.`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to scrape HackerNews: ${error.message}`);
      return [];
    }
  }
}
