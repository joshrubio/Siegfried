"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBox from "@/components/SearchBox";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle vault sidebar"
            className="md:hidden shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="size-4" />
          </Button>
        )}
        <Link href="/" className="font-semibold tracking-tight shrink-0">
          Siegfried
        </Link>
        <div className="flex-1 flex justify-center min-w-0">
          <SearchBox />
        </div>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="shrink-0"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        )}
      </div>
    </header>
  );
}
