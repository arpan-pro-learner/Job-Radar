import { YCJobsScraper } from './src/ingestion/scrapers/yc.scraper';
import { LetsCodeScraper } from './src/ingestion/scrapers/lets-code.scraper';

async function test() {
  try {
    console.log('Testing YCJobs...');
    const ycScraper = new YCJobsScraper();
    const ycRes = await ycScraper.scrape();
    console.log(`YCJobs returned ${ycRes.length} jobs`);
  } catch (e) {
    console.error('YCJobs failed:', e);
  }

  try {
    console.log('\nTesting LetsCode...');
    const lcScraper = new LetsCodeScraper();
    const lcRes = await lcScraper.scrape();
    console.log(`LetsCode returned ${lcRes.length} jobs`);
  } catch (e) {
    console.error('LetsCode failed:', e);
  }
}

test();
