import fs from "fs/promises";
import { PROGRESS_FILE } from "./config";
import { ProgressState } from "./types";

export async function saveProgress(state: ProgressState): Promise<void> {
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(state, null, 2), "utf-8");
  console.log("Progress saved.");
}

export async function loadProgress(): Promise<ProgressState | null> {
  try {
    const data = await fs.readFile(PROGRESS_FILE, "utf-8");
    return JSON.parse(data) as ProgressState;
  } catch (error) {
    return null;
  }
}
