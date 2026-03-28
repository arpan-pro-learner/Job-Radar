import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IngestionService } from './ingestion/ingestion.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingestionService = app.get(IngestionService);
  
  console.log('--- Starting Full CLI Ingestion Test ---');
  try {
    const res = await ingestionService.ingestAll();
    console.log('Ingestion completed successfully:', res);
  } catch (err) {
    console.error('Ingestion failed:', err);
  } finally {
    await app.close();
  }
}

bootstrap();
