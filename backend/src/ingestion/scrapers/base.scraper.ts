import { Logger } from '@nestjs/common';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export abstract class BaseScraper {
  protected readonly logger = new Logger(this.constructor.name);

  abstract scrape(): Promise<CreateStartupDto[]>;

  protected cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  protected generateScores(data: Partial<CreateStartupDto>): Partial<CreateStartupDto> {
    // Scores are now either set by JobFilter (heuristic) or updated by AiService in IngestionService.
    // This method remains as a simple mapper if needed for other defaults.
    return {
      hiringScore: data.hiringScore || 0,
      growthScore: 0,
      remoteScore: data.remoteScore || (data.location?.toLowerCase().includes('remote') ? 100 : 50),
      techStackScore: data.techStackScore || 0,
      ...data,
    };
  }
}
