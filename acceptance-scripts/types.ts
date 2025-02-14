export interface ProgressState {
  totalToAccept: number;
  acceptedCount: number;
  lastProcessedId?: string;
  normalizedAt?: string;
}
