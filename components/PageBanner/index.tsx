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
    <div className={cn("w-full rounded-lg border p-8", className)}>
      {backButton && (
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm transition-colors hover:text-foreground max-sm:text-xs"
        >
          <ChevronLeft className="size-4" /> Back
        </button>
      )}
      {heading ? (
        <p className="font-medium text-foreground md:text-lg">{heading}</p>
      ) : (
        <div className="flex items-center gap-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <div
              key={index}
              className="flex items-center font-medium md:text-lg"
            >
              <Link
                href={breadcrumb.href}
                className="capitalize text-foreground"
              >
                {breadcrumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="ml-2 size-5 text-gray-500" />
              )}
            </div>
          ))}
        </div>
      )}

      {subheading && <p className="mt-1 max-md:text-sm">{subheading}</p>}
    </div>
  );
};

export default PageBanner;
