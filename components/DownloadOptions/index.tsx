"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getDownloadableFile } from "@/actions/download-file";
import { saveAs } from "file-saver";

type Props = {
  entity: "users" | "hackers";
};

const DownloadOptions = ({ entity }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = (fileType: "csv" | "json") => {
    startTransition(async () => {
      try {
        //getting data from db
        const data = await getDownloadableFile(entity, fileType);
        if (fileType === "csv") {
          // Format data into a csv-like string
          const csvData = convertArrayToCSV(data);
          const blob = new Blob([csvData], { type: "text/csv" });

          saveAs(blob, `${entity}data.csv`);
        } else if (fileType === "json") {
          // Format data into json format
          const jsonData = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonData], {
            type: "application/json;charset=utf-8;",
          });

          saveAs(blob, `${entity}data.json`);
        }
      } catch (error) {
        toast.error("Something went wrong. Failed to download file.");
      }
    });
  };

  return (
    <div className="h-fit w-fit rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md max-md:w-full">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Download Options
        </h3>
        <p className="text-sm text-muted-foreground">
          Export all {entity} in the database into the file of your choice.
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button
          disabled={isPending}
          variant="outline"
          className="flex-1 bg-background transition-all duration-200 hover:bg-muted"
          onClick={() => handleDownload("csv")}
        >
          Download CSV
        </Button>
        <Button
          disabled={isPending}
          className="flex-1 transition-all duration-200"
          onClick={() => handleDownload("json")}
        >
          Download JSON
        </Button>
      </div>
    </div>
  );
};
export default DownloadOptions;

//helper fn to convert data into csv like string
const convertArrayToCSV = (userList: any) => {
  const keys = Object.keys(userList[0]);

  const csv = [
    keys.join(","), // header row
    ...userList.map((row: any) =>
      keys
        .map((key: any) => {
          const value =
            row[key] !== null && row[key] !== undefined
              ? row[key].toString()
              : "";
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  return csv;
};
