import { Controller, Post, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  trigger() {
    this.logger.log('Ingestion triggered via HTTP. Running in background...');
    
    // Fire and forget to prevent browser timeouts during long AI scoring processes
    this.ingestionService.scrapeAll().catch((error) => {
        this.logger.error('Background ingestion pipeline failed:', error);
    });

    return { 
      status: 'started', 
      message: 'Ingestion pipeline running in background. New jobs will appear over the next few minutes.' 
    };
  }

  @Get('status')
  async getStatus() {
    return this.ingestionService.getStats();
  }
}
