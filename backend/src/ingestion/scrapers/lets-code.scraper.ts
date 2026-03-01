import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class LetsCodeScraper extends BaseScraper {
  private readonly url = 'https://www.lets-code.co.in/startups-list/100-remote-hiring-companies/';

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs from Lets-Code: ${this.url}`);

    try {
      const { data } = await axios.get(this.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        },
      });

      const startups: CreateStartupDto[] = [];

      const rscPatterns = data.match(/"name":"([^"]+)"/g);
      const urlPatterns = data.match(/"websiteUrl":"([^"]+)"/g);
      const genericUrls = data.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);

      const seenUrls = new Set<string>();

      if (rscPatterns && urlPatterns) {
        this.logger.log(`Found ${rscPatterns.length} names and ${urlPatterns.length} URLs in Lets-Code payload.`);
        const count = Math.min(rscPatterns.length, urlPatterns.length);
        for (let i = 0; i < count; i++) {
          try {
            const name = rscPatterns[i].match(/"name":"([^"]+)"/)?.[1] || '';
            const websiteUrl = urlPatterns[i].match(/"websiteUrl":"([^"]+)"/)?.[1] || '';
            if (name && websiteUrl && !seenUrls.has(websiteUrl)) {
                startups.push(this.generateScores({
                  name,
                  websiteUrl,
                  shortDescription: 'Remote company found in Lets-Code directory.',
                  jobTitle: 'Remote Role',
                  location: 'Remote',
                  source: 'Lets-Code',
                  industry: 'Tech',
                }) as CreateStartupDto);
                seenUrls.add(websiteUrl);
            }
          } catch (e) {}
        }
      }

      // Proactive link extraction for high-quality external links
      if (genericUrls) {
          const filteredLinks = genericUrls.filter(l => 
            !l.includes('lets-code') && !l.includes('google') && !l.includes('facebook') && 
            !l.includes('twitter') && !l.includes('linkedin') && !l.includes('_next') &&
            !l.includes('vercel') && !l.includes('react') && l.length < 100
          );
          
          this.logger.log(`Found ${filteredLinks.length} potential company links in Lets-Code.`);
          for (const link of filteredLinks) {
              if (seenUrls.has(link)) continue;
              
              // Try to find a name from the URL
              let name = link.split('/')[2]?.replace('www.', '').split('.')[0];
              name = name.charAt(0).toUpperCase() + name.slice(1);
              
              if (name && name.length > 2) {
                  startups.push(this.generateScores({
                    name,
                    websiteUrl: link,
                    shortDescription: `Remote hiring company (${name}) found via directory links.`,
                    jobTitle: 'Remote Role',
                    location: 'Remote',
                    source: 'Lets-Code',
                    industry: 'Tech',
                  }) as CreateStartupDto);
                  seenUrls.add(link);
              }
          }
      }

      // Fallback: If RSC parsing found nothing, try the previous HTML parsing
      if (startups.length === 0) {
        const $ = cheerio.load(data);
        const content = $('article, .entry-content, main, #main-content');
        content.find('h2, h3, strong').each((i, el) => {
          const name = $(el).text().replace(/^\d+\.\s*/, '').trim();
          if (!name || name.length < 2 || name.length > 40 || 
              ['Learning', 'Community', 'Support', 'Stay Updated'].includes(name)) return;

          let description = '';
          let websiteUrl = '';
          let sibling = $(el).next();
          for (let j = 0; j < 5; j++) {
            if (!sibling.length || $(sibling).is('h2, h3')) break;
            const text = sibling.text().trim();
            if (text.length > 20 && !description) description = text;
            const link = sibling.find('a[href^="http"]').first().attr('href');
            if (link && !websiteUrl) websiteUrl = link;
            sibling = sibling.next();
          }

          if (name && (description || websiteUrl)) {
            startups.push(this.generateScores({
              name,
              websiteUrl: websiteUrl || '',
              shortDescription: description || 'Remote startup mentioned in Lets-Code directory.',
              jobTitle: 'Remote Role',
              location: 'Remote',
              source: 'Lets-Code',
              industry: 'Tech',
            }) as CreateStartupDto);
          }
        });
      }

      this.logger.log(`Found ${startups.length} entries from Lets-Code.`);
      return startups;
    } catch (error) {
      this.logger.error(`Failed to scrape Lets-Code: ${error.message}`);
      return [];
    }
  }
}
