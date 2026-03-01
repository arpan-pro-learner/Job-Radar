import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { IngestionService } from './src/ingestion/ingestion.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingestionService = app.get(IngestionService);
  
  console.log('Starting manual ingestion...');
  const result = await ingestionService.ingestAll();
  console.log('Ingestion result:', result);
  
  await app.close();
}

bootstrap().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
