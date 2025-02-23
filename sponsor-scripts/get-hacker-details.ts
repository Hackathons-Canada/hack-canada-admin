import { db } from "@/lib/db";
import { checkIns, hackerApplications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import { getResumeUrl } from "@/lib/utils";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askFileFormat = (): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(
      "Would you like the output in CSV or JSON format? (csv/json): ",
      (answer) => {
        const format = answer.toLowerCase().trim();
        if (format === "csv" || format === "json") {
          resolve(format);
        } else {
          console.log("Invalid format. Defaulting to JSON...");
          resolve("json");
        }
        rl.close();
      },
    );
  });
};

const convertToCSV = (data: any[]) => {
  if (data.length === 0) return "";

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          // Escape quotes and wrap in quotes if contains comma or newline
          return /[,\n"]/.test(value)
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(","),
    ),
  ];

  return csvRows.join("\n");
};

const getHackerDetails = async () => {
  const hackerDetails = await db
    .select({
      firstName: hackerApplications.firstName,
      lastName: hackerApplications.lastName,
      email: hackerApplications.email,
      github: hackerApplications.github,
      linkedin: hackerApplications.linkedin,
      personalWebsite: hackerApplications.personalWebsite,
      resumeUrl: hackerApplications.resumeUrl,
      age: hackerApplications.age,
    })
    .from(checkIns)
    .innerJoin(
      hackerApplications,
      eq(checkIns.userId, hackerApplications.userId),
    )
    .where(eq(checkIns.eventName, "hackathon-check-in"));

  // Transform resumeUrl for each hacker
  const transformedDetails = hackerDetails.map((hacker) => ({
    ...hacker,
    resumeUrl: hacker.resumeUrl ? getResumeUrl(hacker.resumeUrl) : null,
  }));

  // Get user's preferred format
  const format = await askFileFormat();

  // Determine file name and content based on format
  const fileName = `hacker-details.${format}`;
  const content =
    format === "csv"
      ? convertToCSV(transformedDetails)
      : JSON.stringify(transformedDetails, null, 2);

  // Write to file
  await fs.writeFile(fileName, content);

  console.log(`Total checked-in hackers: ${transformedDetails.length}`);
  console.log(`Hacker details have been saved to ${fileName}`);

  return transformedDetails;
};

getHackerDetails()
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    console.error("Something went wrong:", error);
  });
