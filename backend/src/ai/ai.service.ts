import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface ScoredJob {
  hiringScore: number;
  remoteScore: number;
  techStackScore: number;
  aiSummary: string;
  outreachAngle: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string | undefined;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('GEMINI_API_KEY is not set in environment variables');
    }
  }

  async scoreJob(title: string, description: string): Promise<ScoredJob | null> {
    if (!this.apiKey) return null;

    try {
      const prompt = `
        Analyze the following job title and description and provide a JSON response with scores and insights.
        
        Job Title: ${title}
        Job Description: ${description}

        Target Audience: Software engineers (frontend/fullstack) with 1-4 years of experience.
        Target Tech Stack: React, Next.js, TypeScript, Node.js, AI.

        Return a JSON object with strictly these keys:
        - hiringScore: (0-100) How likely is this a real, urgent hiring signal? Higher if description is detailed and recent.
        - remoteScore: (0-100) 100 if fully remote, 50 if hybrid, 0 if strictly on-site or location-locked.
        - techStackScore: (0-100) How well does it match the target tech stack?
        - aiSummary: (string) A 1-sentence summary of why this is a good/bad match.
        - outreachAngle: (string) A suggested angle for reaching out to the founder or hiring manager.

        JSON Only. No markdown formatting.
      `;

      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      });

      const responseText = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(responseText.trim()) as ScoredJob;
    } catch (error) {
      this.logger.error(`Error calling Gemini API: ${error.message}`);
      if (error.response) {
        this.logger.error(`API Response: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }
}
