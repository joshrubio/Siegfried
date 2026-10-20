"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // One-time hydration-safe mount flag (next-themes' own recommended
    // pattern) — intentionally synchronous, not a subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (pathname === "/login") return null;

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
        <div className="flex-1" />
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
        <form action={signOut}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Sign out" title="Sign out">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
