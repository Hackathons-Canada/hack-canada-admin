"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import DeleteUserModal from "./DeleteUserModal";
import { ArrowUpRightFromSquare, Mail, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  name: string;
  email: string;
  status: ApplicationStatus;
};

const UserActions = ({ id, name, email, status }: Props) => {
  return (
    <div className="flex h-fit w-full flex-col gap-5 rounded-lg border bg-gradient-to-br from-background via-background/80 to-background p-6 md:p-8 xl:max-w-sm xl:gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">Actions</h3>
          <p className="text-sm text-muted-foreground">
            Manage {name}&apos;s account
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          size="icon"
          className="h-8 w-8 transition-all hover:scale-105"
        >
          <Link href={`mailto:${email}`}>
            <Mail className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {status !== "not_applied" && (
          <Button
            asChild
            variant="default"
            className="group w-full gap-2 text-base transition-all"
          >
            <Link href={`/applications/${id}`}>
              <FileText className="size-4 transition-transform group-hover:-translate-y-0.5" />
              View Application
              <ArrowUpRightFromSquare className="size-3.5 opacity-60" />
            </Link>
          </Button>
        )}

        <hr />

        <DeleteUserModal id={id} name={name}>
          <Button
            variant="outline"
            className={cn(
              "group w-full gap-2 text-base transition-all hover:scale-[1.02]",
              "hover:border-destructive hover:bg-destructive hover:text-destructive-foreground",
            )}
          >
            <Trash2 className="size-4 transition-transform group-hover:-translate-y-0.5" />
            Eradicate User
          </Button>
        </DeleteUserModal>
      </div>
    </div>
  );
};

export default UserActions;
