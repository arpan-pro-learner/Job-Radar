import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { HnHiringScraper } from './src/ingestion/scrapers/hn-hiring.scraper';

async function testHn() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scraper = app.get(HnHiringScraper);
  
  console.log('Testing HnHiringScraper (Direct HN Source)...');
  const results = await scraper.scrape();
  console.log(`Results found: ${results.length}`);
  if (results.length > 0) {
    console.log('First result sample:', JSON.stringify(results[0], null, 2));
  }
}

testHn().catch(console.error);
