"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "./mobile-nav";
import { Badge } from "./ui/badge";

export function Header() {
  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between gap-2">
        <MobileNav />
        <nav className="max-md:hidden flex items-center">
          <Link href="/" className="flex gap-3 items-center">
            <h1 className="text-lg font-medium tracking-tighter flex gap-1 items-center">
              DebateAI
            </h1>
            <div>
              <Badge variant="outline" className="text-normal">
                Beta
              </Badge>
            </div>
          </Link>
        </nav>
        <div className="flex gap-3 items-center justify-end ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
