"use client";

import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo, LogoIcon } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on the compare page to hide the CTA
  const isComparePage = pathname?.includes("/compare");

  const navLinks = [
    { href: "/compare", label: t("nav.compare") },
    { href: "/guide/spreadsheet-comparison", label: t("nav.guide") },
    { href: "/blog", label: t("nav.blog") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <LogoIcon size={32} />
          <span className="font-display font-bold text-lg hidden sm:block">
            Diff<span className="text-green-900 dark:text-green-100">Sheets</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 font-display font-medium text-sm text-muted-foreground transition-colors hover:text-green-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://github.com/LyricalString/diffsheets"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("github")}
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          <div className="h-5 w-px bg-border mx-1" aria-hidden="true" />

          <ThemeToggle />

          {!isComparePage && (
            <>
              <div className="h-5 w-px bg-border mx-1" aria-hidden="true" />
              <Button
                asChild
                size="sm"
                className="bg-green-500 hover:bg-green-400 text-slate-950 font-semibold shadow-sm shadow-green-500/20 hover:shadow-green-500/30 transition-all"
              >
                <Link href="/compare">{tCommon("tryNow")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: Actions + Menu Button */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="ml-1"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl font-display font-medium text-muted-foreground transition-colors hover:text-green-500 hover:bg-green-500/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-border/40">
              <a
                href="https://github.com/LyricalString/diffsheets"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-display font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </div>

            {!isComparePage && (
              <div className="pt-3">
                <Button
                  asChild
                  className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-semibold shadow-sm shadow-green-500/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/compare">{tCommon("tryNow")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
