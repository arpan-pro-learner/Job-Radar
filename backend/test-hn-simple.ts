import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './src/ingestion/scrapers/base.scraper';
import { CreateStartupDto } from './src/startups/dto/create-startup.dto';
import { HnHiringScraper } from './src/ingestion/scrapers/hn-hiring.scraper';

async function testHnSimple() {
  const scraper = new HnHiringScraper();
  
  console.log('Testing HnHiringScraper (Direct HN Source) WITHOUT NestJS...');
  try {
    const results = await scraper.scrape();
    console.log(`Results found: ${results.length}`);
    if (results.length > 0) {
      console.log('First result sample:', JSON.stringify(results[0], null, 2));
    } else {
        console.log('NO RESULTS FOUND. Checking why...');
    }
  } catch (error) {
    console.error('Scraping error:', error.message);
  }
}

testHnSimple();
