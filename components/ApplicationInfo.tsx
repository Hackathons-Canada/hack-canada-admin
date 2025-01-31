import { HackerApplicationsSelectData } from "@/lib/db/schema";
import { cn, formatDate } from "@/lib/utils";
import { CheckCircle, CircleX, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

type Props = {
  hacker: HackerApplicationsSelectData | null;
};

const HackerInfo = ({ hacker }: Props) => {
  if (!hacker) {
    return (
      <div className="">
        <p>Could not find a hacker with the given ID.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border p-4 md:p-8">
      <div className="flex w-full flex-col divide-y-2">
        <p className="mb-4 text-lg text-foreground">General</p>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">ID</p>
          <p className="w-1/2 break-words text-right">{hacker.userId}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">First Name</p>
          <p className="w-1/2 text-right">{hacker.firstName}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Last Name</p>
          <p className="w-1/2 text-right">
            {hacker.lastName || (
              <b className="text-zinc-300 dark:text-zinc-600">N/A</b>
            )}
          </p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Email Address</p>
          <p title={hacker.email} className="w-1/2 break-words text-right">
            {hacker.email}
          </p>
        </div>

        {/* <p className="py-4 text-lg text-foreground">Demographic Info</p> */}

        <div
          className={cn("flex justify-between gap-12 py-4 lg:gap-12", {
            "bg-destructive px-4 text-red-100": hacker.age < 18,
          })}
        >
          <p className="w-1/2">Age</p>
          <p className="w-1/2 text-right">
            {hacker.age + " years old" + (hacker.age < 18 ? " (too tiny)" : "")}
          </p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Pronouns</p>
          <p className="w-1/2 text-right">{hacker.pronouns}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Gender</p>
          <p className="w-1/2 text-right">{hacker.gender}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">School</p>
          <p className="w-1/2 text-right">{hacker.school}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Race / Ethnicity</p>
          <p className="w-1/2 text-right">{hacker.raceEthnicity}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Level of Study</p>
          <p className="w-1/2 text-right">{hacker.levelOfStudy}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Major / Field of Study</p>
          <p className="w-1/2 text-right">{hacker.majorFieldOfStudy}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Registration Date</p>
          <p className="w-1/2 text-right">
            {formatDate(hacker.createdAt.toString())}
          </p>
        </div>

        <p className="py-4 text-lg text-foreground">Application Questions</p>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="font-semibold text-foreground">
            If you could have any superpower for the duration of the hackathon,
            what would it be and why?
          </p>
          <p className="">{hacker.applicationQuestion1}</p>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="font-semibold text-foreground">
            Imagine you could spend a day in any fictional universe. Which one
            would you pick and why? Feel free to draw inspiration from shows,
            anime, video games, etc.
          </p>
          <p className="">{hacker.applicationQuestion2}</p>
        </div>

        <p className="py-4 text-lg text-foreground">Hackathon Questions</p>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Resume</p>
          <Link
            target="_blank"
            href={hacker.resumeUrl}
            className="flex w-1/2 items-center justify-end gap-2 text-nowrap text-right underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Click to view <SquareArrowOutUpRight className="size-4" />
          </Link>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Share Resume?</p>
          <p className="w-1/2 text-right">
            {hacker.shareResume ? "Yes" : "No"}
          </p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">T-Shirt Size</p>
          <p className="w-1/2 text-right">{hacker.tshirtSize}</p>
        </div>

        <div className="flex justify-between gap-12 py-4 lg:gap-12">
          <p className="w-1/2">Dietary Restrictions</p>
          <p className="w-1/2 text-right">{hacker.dietaryRestrictions}</p>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="">
            I will be 18 years old or older by September 27, 2024.
          </p>
          <p className="flex items-center gap-1.5">
            {hacker.isOver18 ? (
              <>
                <CheckCircle className="size-4 text-green-800" />
                <span>Checked</span>
              </>
            ) : (
              <>
                <CircleX className="size-4 text-red-800" />
                <span>Unchecked</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="">I agree to the MLH Code of Conduct.</p>
          <p className="flex items-center gap-1.5">
            {hacker.mlhCheckbox1 ? (
              <>
                <CheckCircle className="size-4 text-green-800" />
                <span>Checked</span>
              </>
            ) : (
              <>
                <CircleX className="size-4 text-red-800" />
                <span>Unchecked</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="">
            I consent to sharing my info with Major League Hacking.
          </p>
          <p className="flex items-center gap-1.5">
            {hacker.mlhCheckbox2 ? (
              <>
                <CheckCircle className="size-4 text-green-800" />
                <span>Checked</span>
              </>
            ) : (
              <>
                <CircleX className="size-4 text-red-800" />
                <span>Unchecked</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          <p className="">
            I agree to receive emails from Major League Hacking.
          </p>
          <p className="flex items-center gap-1.5">
            {hacker.isOver18 ? (
              <>
                <CheckCircle className="size-4 text-green-800" />
                <span>Checked</span>
              </>
            ) : (
              <>
                <CircleX className="size-4 text-red-800" />
                <span>Unchecked</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
export default HackerInfo;
