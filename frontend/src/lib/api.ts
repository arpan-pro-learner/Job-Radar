import { Startup } from "./mock-data";

const IS_PROD = process.env.NODE_ENV === 'production';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

if (IS_PROD && !process.env.NEXT_PUBLIC_API_URL) {
  // Silent fallback for production stability, although this is a misconfiguration
}

export async function fetchStartups(): Promise<Startup[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error body');
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }
    
    return res.json();
  } catch (error) {
    console.warn(`Failed to fetch from ${API_BASE_URL}:`, error);
    return [];
  }
}

export async function triggerIngestion() {
  try {
    const res = await fetch(`${API_BASE_URL}/ingestion/trigger`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to trigger ingestion:", error);
    return false;
  }
}
