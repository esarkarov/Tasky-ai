import { env } from '@/config/env.config';
import { GoogleGenAI } from '@google/genai';

export const genAI = new GoogleGenAI({ apiKey: env.geminiApiKey });
