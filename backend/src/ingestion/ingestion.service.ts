import { Injectable, Logger } from '@nestjs/common';
import { StartupsService } from '../startups/startups.service';
import { HnHiringScraper } from './scrapers/hn-hiring.scraper';
import { RedditScraper } from './scrapers/reddit.scraper';
import { LetsCodeScraper } from './scrapers/lets-code.scraper';
import { BaseScraper } from './scrapers/base.scraper';
import { JobFilter } from './utils/job-filter.util';
import { AiService } from '../ai/ai.service';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly scrapers: BaseScraper[];

  constructor(
    private readonly startupsService: StartupsService,
    private readonly aiService: AiService
  ) {
    this.scrapers = [
      new HnHiringScraper(),
      new RedditScraper(),
      new LetsCodeScraper()
    ];
  }

  async ingestAll() {
    this.logger.log('Starting full ingestion job...');
    let totalCount = 0;

    for (const scraper of this.scrapers) {
      try {
        const jobs = await scraper.scrape();
        this.logger.log(`Scraper ${scraper.constructor.name} found ${jobs.length} jobs.`);
        
        for (const job of jobs) {
          const filterResult = JobFilter.filter(job.name + ' ' + (job.jobTitle || ''), job.shortDescription || '');
          
          if (!filterResult.passed) {
            this.logger.debug(`Filtering out ${job.name}: ${filterResult.reason}`);
            continue;
          }

          // Use the filter score as the base hiring score initially
          job.hiringScore = filterResult.score;

          // Enhance with AI scoring 
          try {
            const aiResult = await this.aiService.scoreJob(job.jobTitle || job.name, job.shortDescription || '');
            if (aiResult) {
              this.logger.log(`AI Scored ${job.name}: hiring=${aiResult.hiringScore}, remote=${aiResult.remoteScore}, tech=${aiResult.techStackScore}`);
              job.hiringScore = aiResult.hiringScore;
              job.remoteScore = aiResult.remoteScore;
              job.techStackScore = aiResult.techStackScore;
              job.aiSummary = aiResult.aiSummary;
              job.outreachAngle = aiResult.outreachAngle;
            }
          } catch (aiError) {
            this.logger.error(`AI scoring failed for ${job.name}: ${aiError.message}`);
          }
          
          await this.startupsService.upsert(job);
          totalCount++;
        }
      } catch (error) {
        this.logger.error(`Error during scraping with ${scraper.constructor.name}: ${error.message}`);
      }
    }

    this.logger.log(`Full ingestion completed. Total jobs processed: ${totalCount}`);
    return { count: totalCount, message: 'Ingestion completed' };
  }

  // Deprecated individual method
  async scrapeAll() {
    return this.ingestAll();
  }

  async getStats() {
    const sources = ['HN Hiring', 'Reddit', 'Lets-Code'];
    const stats: Record<string, number> = {};
    
    for (const source of sources) {
        const count = await this.startupsService.countBySource(source);
        stats[source] = count;
    }
    
    const total = await this.startupsService.countAll();
    
    return {
        total,
        breakdown: stats,
        timestamp: new Date().toISOString()
    };
  }
}

