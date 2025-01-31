"use client";

import { useEffect, useState } from "react";

export default function AuthErrorPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-background">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />

      {/* Background animation */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="animate-float absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 3 + 2}rem`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          >
            {Math.random() > 0.5 ? "💀" : "😹"}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <div className="animate-[float_6s_ease-in-out_infinite] space-y-6 rounded-2xl bg-background/30 p-6 shadow-xl backdrop-blur-sm md:space-y-8 md:p-8">
          {/* Emoji container */}
          <div className="flex items-center justify-center gap-4 text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            <div className="group transition-all duration-500">
              <div className="transform animate-[wiggle_1s_ease-in-out_infinite] transition-transform group-hover:animate-[wiggle_0.5s_ease-in-out_infinite] group-hover:[transform:scale(1.5)_rotate(0deg)]">
                🫵
              </div>
            </div>
            <div className="group transition-all duration-500">
              <div className="transform animate-[bounce_1s_ease-in-out_infinite_0.5s] transition-transform group-hover:[transform:scale(1.5)]">
                <span className="inline-block group-hover:animate-[wiggle_0.5s_ease-in-out_infinite]">
                  😹
                </span>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-3 text-center md:space-y-4">
            <h1 className="animate-pulse bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
              Oops! You&apos;re not authorized to be here!
            </h1>
            <p className="animate-[slideIn_1s_ease-out] text-lg text-muted-foreground/80 sm:text-xl md:text-2xl">
              Looks like someone&apos;s trying to sneak in! 🫵😹
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
