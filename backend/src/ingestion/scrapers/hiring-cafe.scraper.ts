import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class HiringCafeScraper extends BaseScraper {
  private readonly searchUrl = 'https://hiring.cafe/?searchState=%7B%22departments%22%3A%5B%22Software+Development%22%2C%22Engineering%22%2C%22Information+Technology%22%5D%2C%22dateFetchedPastNDays%22%3A14%2C%22seniorityLevel%22%3A%5B%22No+Prior+Experience+Required%22%2C%22Entry+Level%22%5D%2C%22jobTitleQuery%22%3A%22%5C%22software+engineer%5C%22%5C%22frontend+engineer%5C%22%5C%22fullstack+developer%5C%22%5C%22frontend+developer%5C%22%22%2C%22roleTypes%22%3A%5B%22Individual+Contributor%22%5D%2C%22roleYoeRange%22%3A%5B0%2C2%5D%2C%22commitmentTypes%22%3A%5B%22Full+Time%22%2C%22Part+Time%22%2C%22Contract%22%2C%22Internship%22%2C%22Temporary%22%5D%2C%22defaultToUserLocation%22%3Afalse%2C%22workplaceTypes%22%3A%5B%22Remote%22%5D%2C%22applicationFormEase%22%3A%5B%22Simple%22%5D%7D';

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs from Hiring Cafe: ${this.searchUrl}`);

    try {
      // Decode user search state from URL
      const url = new URL(this.searchUrl);
      const searchStateParam = url.searchParams.get('searchState');
      const searchState = searchStateParam ? JSON.parse(decodeURIComponent(searchStateParam)) : null;

      if (searchState) {
        this.logger.log('Attempting direct API POST request to Hiring Cafe...');
        try {
          const apiResponse = await axios.post('https://hiring.cafe/api/jobs/search', searchState, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Content-Type': 'application/json',
              'Referer': 'https://hiring.cafe/',
              'Origin': 'https://hiring.cafe',
              'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
              'Sec-Ch-Ua-Mobile': '?0',
              'Sec-Ch-Ua-Platform': '"macOS"',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
            }
          });

          if (apiResponse.data?.jobs) {
            return this.parseJobs(apiResponse.data.jobs);
          }
        } catch (apiError) {
          this.logger.warn(`Direct API POST failed: ${apiError.message}. Falling back to HTML/NEXT_DATA.`);
        }
      }

      // Fallback to getting __NEXT_DATA__
      const { data } = await axios.get(this.searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        },
      });

      const $ = cheerio.load(data);
      const nextDataScript = $('script#__NEXT_DATA__').html();

      if (nextDataScript) {
        return this.parseNextData(nextDataScript);
      }

      this.logger.warn('Could not find __NEXT_DATA__ on Hiring Cafe.');
      return [];
    } catch (error) {
      this.logger.error(`Failed to scrape Hiring Cafe: ${error.message}`);
      return [];
    }
  }

  private parseNextData(jsonStr: string): CreateStartupDto[] {
    try {
      const nextData = JSON.parse(jsonStr);
      const results = nextData?.props?.pageProps?.jobs || 
                      nextData?.props?.pageProps?.initialJobs?.jobs || [];
      return this.parseJobs(results);
    } catch (error) {
      this.logger.error(`Error parsing Hiring Cafe NextData: ${error.message}`);
      return [];
    }
  }

  private parseJobs(results: any[]): CreateStartupDto[] {
    const jobs: CreateStartupDto[] = [];
    for (const item of results) {
      const startupDto: CreateStartupDto = {
        name: item.companyName || item.company?.name || 'Unknown Company',
        websiteUrl: item.companyWebsite || item.company?.url || '',
        careersUrl: item.applicationUrl || item.url || '',
        shortDescription: item.descriptionSnippet || item.jobDescription || '',
        jobTitle: item.title || 'Software Engineer',
        location: item.location || item.workplaceType || 'Remote',
        source: 'Hiring Cafe',
      };
      jobs.push(this.generateScores(startupDto) as CreateStartupDto);
    }
    this.logger.log(`Parsed ${jobs.length} jobs from Hiring Cafe API result.`);
    return jobs;
  }
}
