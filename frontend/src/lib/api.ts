import { Startup } from "./mock-data";

export async function fetchStartups(): Promise<Startup[]> {
  try {
    const res = await fetch('http://localhost:3001/startups', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch startups');
    return res.json();
  } catch (error) {
    console.warn("Failed to fetch real data, falling back to mock", error);
    return [];
  }
}

export async function triggerIngestion() {
  await fetch('http://localhost:3001/ingestion/trigger', { method: 'POST' });
}
