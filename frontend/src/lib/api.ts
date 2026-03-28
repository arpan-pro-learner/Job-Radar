import { Startup } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function fetchStartups(): Promise<Startup[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch startups');
    return res.json();
  } catch (error) {
    console.warn("Failed to fetch real data, falling back to mock", error);
    return [];
  }
}

export async function triggerIngestion() {
  await fetch(`${API_BASE_URL}/ingestion/trigger`, { method: 'POST' });
}
