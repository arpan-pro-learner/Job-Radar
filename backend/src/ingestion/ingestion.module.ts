import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { StartupsModule } from '../startups/startups.module';
import { IngestionController } from './ingestion.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [StartupsModule, AiModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
