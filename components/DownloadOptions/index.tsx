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
    <div className="h-fit w-fit rounded-lg border p-6 max-md:w-full md:p-10">
      <p className="text-lg font-semibold text-foreground md:text-xl">
        Download Options
      </p>
      <p>Export all {entity} in the database into the file of your choice.</p>
      <div className="mt-4 flex gap-4 max-sm:flex-col">
        <Button
          disabled={isPending}
          className="w-full"
          onClick={() => handleDownload("csv")}
        >
          Download as CSV
        </Button>
        <Button
          disabled={isPending}
          className="w-full"
          onClick={() => handleDownload("json")}
        >
          Download as JSON
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
      keys.map((key: any) => {
        const value = row[key] !== null && row[key] !== undefined ? row[key].toString() : '';
        return `"${value.replace(/"/g, '""')}"`; 
      }).join(",")
    ),
  ].join("\n");
  

  return csv;
};
