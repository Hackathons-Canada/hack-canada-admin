import path from "path";
import { loadEnvConfig } from "@next/env";

// Load environment variables
const dev = process.env.NODE_ENV !== "production";
const { combinedEnv } = loadEnvConfig(process.cwd(), dev, {
  info: console.log,
  error: console.error,
});
Object.assign(process.env, combinedEnv);

// Constants
export const TARGET_AVG = 5.4; // Target average rating
export const MIN_REVIEWS_THRESHOLD = 3; // Minimum reviews needed for reviewer stats
export const MIN_REVIEW_VALUE_THRESHOLD = 4.0; // Minimum average review value needed to be considered
export const ZSCORE_THRESHOLD = 2.0; // Z-score threshold for detecting outliers
export const PROGRESS_FILE = path.join(
  process.cwd(),
  "acceptance-progress.json",
);
