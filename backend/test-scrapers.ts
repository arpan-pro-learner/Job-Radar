import { HnHiringScraper } from './src/ingestion/scrapers/hn-hiring.scraper';
import { RedditScraper } from './src/ingestion/scrapers/reddit.scraper';

async function test() {
  const hnScraper = new HnHiringScraper();
  Object.defineProperty(hnScraper, 'logger', { value: { log: console.log, error: console.error, warn: console.warn } });
  
  const hnJobs = await hnScraper.scrape();
  console.log(`HN Jobs Found: ${hnJobs.length}`);
  if(hnJobs.length > 0) console.log(hnJobs[0]);

  const redditScraper = new RedditScraper();
  Object.defineProperty(redditScraper, 'logger', { value: { log: console.log, error: console.error, warn: console.warn } });
  const redditJobs = await redditScraper.scrape();
  console.log(`Reddit Jobs Found: ${redditJobs.length}`);
  if(redditJobs.length > 0) console.log(redditJobs[0]);
}

test().catch(console.error);
