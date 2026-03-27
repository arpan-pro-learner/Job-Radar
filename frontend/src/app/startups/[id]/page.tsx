import { notFound } from "next/navigation";
import { MOCK_STARTUPS } from "@/lib/mock-data";
import { StartupDetailsContent } from "@/components/startup/startup-details-content";

// Helper to get startup data
async function getStartup(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/startups/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        // Fallback to mock search
        return MOCK_STARTUPS.find(s => s.id === id) || null;
    }
    return res.json();
  } catch (e) {
    return MOCK_STARTUPS.find(s => s.id === id) || null;
  }
}

export default async function StartupDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startup = await getStartup(id);

  if (!startup) {
    notFound();
  }

  return <StartupDetailsContent startup={startup} />;
}
