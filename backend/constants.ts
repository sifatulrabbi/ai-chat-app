import { config } from "dotenv";

const result = config();
if (result.error) {
  console.error("Error loading .env file", result.error);
  process.exit(1);
}
console.log("Loaded .env file");

export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY!;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT!, 10);
