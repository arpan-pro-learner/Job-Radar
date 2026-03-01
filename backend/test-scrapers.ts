import { HnHiringScraper } from './src/ingestion/scrapers/hn.scraper';
import { YCJobsScraper } from './src/ingestion/scrapers/yc.scraper';
import { RedditScraper } from './src/ingestion/scrapers/reddit.scraper';
import { LetsCodeScraper } from './src/ingestion/scrapers/lets-code.scraper';

async function testScrapers() {
  console.log('--- Testing HN Scraper ---');
  const hn = new HnHiringScraper();
  const hnJobs = await hn.scrape();
  console.log(`HN Jobs found: ${hnJobs.length}`);
  if (hnJobs.length > 0) console.log('Sample HN job:', hnJobs[0]);

  console.log('\n--- Testing YC Scraper ---');
  const yc = new YCJobsScraper();
  const ycJobs = await yc.scrape();
  console.log(`YC Jobs found: ${ycJobs.length}`);
  if (ycJobs.length > 0) console.log('Sample YC job:', ycJobs[0]);

  console.log('\n--- Testing Reddit Scraper ---');
  const reddit = new RedditScraper();
  const redditJobs = await reddit.scrape();
  console.log(`Reddit Jobs found: ${redditJobs.length}`);
  if (redditJobs.length > 0) console.log('Sample Reddit job:', redditJobs[0]);


  console.log('\n--- Testing Lets-Code Scraper ---');
  const letsCode = new LetsCodeScraper();
  const letsCodeJobs = await letsCode.scrape();
  console.log(`Lets-Code Jobs found: ${letsCodeJobs.length}`);
  if (letsCodeJobs.length > 0) console.log('Sample Lets-Code job:', letsCodeJobs[0]);

}

testScrapers().catch(console.error);
