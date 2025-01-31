"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  backButton?: boolean;
  name?: string | null;
  heading?: string;
  subheading?: string;
  className?: string;
};

const PageBanner = ({
  backButton,
  heading,
  subheading,
  name,
  className,
}: Props) => {
  const router = useRouter();
  let pathname = usePathname();

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment);
    return pathSegments.map((segment, index) => {
      if (index === 1 && name) {
        segment = name;
      }
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        label: segment,
        href: href,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div
      className={cn(
        "w-full rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md lg:p-8",
        className,
      )}
    >
      {backButton && (
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground max-sm:text-xs"
        >
          <ChevronLeft className="size-4" /> Back
        </button>
      )}
      <div className="space-y-3">
        {heading ? (
          <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
            {heading}
          </h1>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={index} className="flex items-center">
                <Link
                  href={breadcrumb.href}
                  className="text-lg font-semibold capitalize text-foreground transition-colors hover:text-primary lg:text-xl"
                >
                  {breadcrumb.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="ml-2 size-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        )}

        {subheading && (
          <p className="text-sm text-muted-foreground md:text-base lg:max-w-[80ch]">
            {subheading}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
