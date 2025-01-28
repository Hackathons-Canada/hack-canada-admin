"use client";

import { cn, formatApplicationStatus } from "@/lib/utils";
import { Hacker } from "@/types/hacker";
import { ExternalLinkIcon, Menu } from "lucide-react";
import Link from "next/link";
import HackerStatusModal from "../HackerStatusModal";
import { useEffect, useRef, useState } from "react";

type Props = {
  hackers: Hacker[];
};

const HackerList = ({ hackers }: Props) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
        console.log(scrollLeft, scrollWidth, clientWidth);
        setShowShadow(scrollLeft + 0.5 + clientWidth < scrollWidth);
      }
    };

    if (tableRef.current) {
      tableRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (tableRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tableRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (hackers.length === 0) {
    return null;
  }

  return (
    <div ref={tableRef} className="overflow-x-auto">
      {/* Shadow based on if the table is scrolled or not */}
      <span
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/25 to-transparent transition-opacity duration-300 dark:from-black/35",
          {
            "opacity-0": !showShadow,
          },
        )}
      />
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-zinc-200 dark:bg-zinc-950">
          <tr className="rounded-t-lg text-center text-xs font-semibold uppercase tracking-wider text-gray-500 md:text-sm [&>th]:border-2 [&>th]:px-1.5">
            <th className="w-[200px] py-2">Update Status</th>
            <th className="w-[120px]">Status</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>School</th>
          </tr>
        </thead>

        <tbody className="">
          {hackers.map((hacker, index) => (
            <tr
              key={index}
              className={cn(
                "border-2 py-2 hover:bg-stone-100 dark:hover:bg-zinc-950 max-md:text-sm",
                hacker.age < 18
                  ? hacker.isOver18 === true
                    ? "bg-yellow-600/25 hover:bg-yellow-600/40 dark:hover:bg-yellow-600/40"
                    : "bg-red-600/25 hover:bg-red-600/40 dark:hover:bg-red-600/40"
                  : "",
              )}
            >
              <td className="w-[200px] overflow-x-hidden border-2 p-2 text-center">
                <div className="flex items-center justify-center space-x-2 divide-x-2">
                  <Link
                    title="View Application"
                    href={`/hackers/${hacker.userId}`}
                    prefetch={false}
                    className="inline-block align-middle underline underline-offset-4"
                  >
                    {/* <ExternalLinkIcon size={20} /> */}
                    View
                  </Link>
                  <HackerStatusModal
                    userId={hacker.userId}
                    name={hacker.firstName || "no name"}
                    email={hacker.email}
                    age={hacker.age}
                    status={hacker.applicationStatus}
                  >
                    <button className="pl-2 underline underline-offset-4">
                      Update
                    </button>
                  </HackerStatusModal>
                </div>
              </td>
              <td className="w-[160px] overflow-x-hidden border-2 px-3 py-2 text-center">
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-1 text-xs font-semibold",
                    {
                      "bg-amber-200 text-amber-800":
                        hacker.applicationStatus === "pending" ||
                        hacker.applicationStatus === "waitListed",
                      "bg-emerald-200 text-emerald-800":
                        hacker.applicationStatus === "accepted",
                      "bg-red-200 text-red-800":
                        hacker.applicationStatus === "rejected",
                    },
                  )}
                >
                  {formatApplicationStatus(hacker.applicationStatus)}
                </span>
              </td>
              <td className="overflow-x-hidden border-2 px-3 py-2">
                {`${hacker.firstName} ${hacker.lastName}`}
              </td>
              <td className="overflow-x-hidden border-2 px-3 py-2 text-center">
                <p className="">{hacker.age}</p>
              </td>
              <td
                title={hacker.school}
                className="max-w-[250px] overflow-x-hidden truncate border-2 px-3 py-2"
              >
                {hacker.school}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default HackerList;
