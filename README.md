# 📡 Job Radar

> **Cut the noise. Find your next great startup job.**

Job Radar is a smart, curated job discovery platform built for developers who want *quality over quantity*. Instead of scrolling through bloated job boards full of outdated listings, Job Radar aggregates niche sources, applies AI scoring, and surfaces the best startup opportunities—fresh, filtered, and ready to act on.

---

## 🎯 The Vision

Traditional job boards are broken. They're full of ghost postings, irrelevant listings, and companies that haven't hired in months. Job Radar's mission is simple:

- ✅ Aggregate from **developer-focused, niche sources**
- ✅ Apply **AI scoring** to rank each opportunity by what matters to you
- ✅ Surface the **freshest leads** in a beautiful, easy-to-use interface

---

## ✅ What We've Built So Far

### 🤖 Data Ingestion Pipeline
- Abstract `BaseScraper` class for a standardized, extensible scraping architecture
- Active scrapers pulling real-time jobs from:
  - **HN Hiring** (`hnhiring.com/locations/remote`)
  - **Reddit** (`r/hiring`, `r/forhire`, `r/JobPostings`)
  - **Lets-Code**
- Initial keyword filtering to return only high-quality dev leads

### 🧠 AI-Powered Analysis (Gemini API)
Each job gets analyzed and scored across three dimensions:
| Score | What it means |
|---|---|
| 🔥 `hiringScore` | How urgently is this company hiring? |
| 🌍 `remoteScore` | How remote-friendly is this role? |
| 💻 `techStackScore` | How well does their stack match modern dev skills? |

Plus a human-readable `aiSummary` and an `outreachAngle` to give you a head start on your application.

### 🖥️ Modern Discovery UI
- Full-text **search** with server-side filtering
- **Pagination** for smooth navigation
- "**New**" badge for jobs updated within the last 24 hours
- "**Apply Now**" button with direct links to job applications
- Source filtering and sorting by freshness

### 🗄️ Optimized Data Layer
- Migrated to **SQLite** for frictionless local development
- Flexible DB config in `app.module.ts` to support future cloud DB providers

---

## 🛠️ Tech Stack

### Frontend
| Tech | Role |
|---|---|
| **Next.js** (React) | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |

### Backend
| Tech | Role |
|---|---|
| **NestJS** | Backend API Framework |
| **TypeScript** | Type Safety |
| **SQLite + TypeORM** | Database & ORM |
| **Gemini API** (via `axios`) | AI Scoring & Summaries |

### Core Data Flow
```
[Scraper Sources]
  HN Hiring, Reddit, Lets-Code
       │
       ▼
[IngestionService]
  Fetches & keyword-filters raw posts
       │
       ▼
[AiModule (Gemini)]
  Scores, summarizes & adds outreach angles
       │
       ▼
[SQLite Database]
  Stores enriched job records
       │
       ▼
[Next.js Frontend]
  Search, filter, sort & display jobs
```

---

## 🗺️ Future Roadmap

Here's what's coming next:

- [ ] 🔘 **One-click "Refresh Jobs"** button on the frontend to trigger a new scrape run on demand
- [ ] 🔎 **Advanced Filters** — filter by industry, location, experience level, and tech stack
- [ ] 🌐 **More Scraper Sources** — research and add scraping for new high-signal job boards
- [ ] 🔗 **Direct ATS Apply Links** — refine scrapers to extract exact application URLs instead of company homepages
- [ ] 🏢 **Company Logos & Metadata** — make job cards richer with logos and salary range hints
- [ ] ⚡ **Incremental Updates & Caching** — keep the DB fresh without full re-ingestion cycles

---

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

*Built with ❤️ to make the job hunt a little less painful.*
