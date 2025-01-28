import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { fredoka, rubik } from "@/lib/fonts";
import Providers from "../components/providers";

export const metadata: Metadata = {
  title: "HC Admin",
  description: "Hack Canada Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("", fredoka.className, rubik.variable)}>
        <Toaster richColors position="bottom-center" />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
