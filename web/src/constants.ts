export const REST_API_URL = import.meta.env.VITE_REST_API_URL as string;
if (!REST_API_URL) {
  throw new Error("VITE_REST_API_URL is not set in .env");
}
