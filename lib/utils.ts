import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${timePart} | ${datePart}`;
}

export function formatApplicationStatus(status: ApplicationStatus) {
  switch (status) {
    case "not_applied":
      return "Not Applied";
    case "pending":
      return "Under Review";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "waitlisted":
      return "Waitlisted";
    case "cancelled":
      return "Cancelled";
    default:
      return "Not Applied";
  }
}
