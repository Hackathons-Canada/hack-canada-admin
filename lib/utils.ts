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
    timeZone: "America/Toronto",
  });
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Toronto",
  });

  return `${timePart} | ${datePart}`;
}

export function formatApplicationStatus(status: ApplicationStatus) {
  switch (status) {
    case "not_applied":
      return "Not Applied";
    case "pending":
      return "Pending";
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

export const getResumeUrl = (key: string) => {
  return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

export const isAdmin = (role: string): boolean => {
  return role === "admin";
};

export const isReviewer = (role: string): boolean => {
  return role === "organizer" || role === "admin";
};
