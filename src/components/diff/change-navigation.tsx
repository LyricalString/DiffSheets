"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ChangeNavigationProps {
  currentIndex: number;
  totalChanges: number;
  onNavigate: (index: number) => void;
  className?: string;
}

export function ChangeNavigation({
  currentIndex,
  totalChanges,
  onNavigate,
  className,
}: ChangeNavigationProps) {
  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalChanges - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, totalChanges, onNavigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "j":
        case "ArrowDown":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            goToNext();
          }
          break;
        case "k":
        case "ArrowUp":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            goToPrev();
          }
          break;
        case "n":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            goToNext();
          }
          break;
        case "p":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            goToPrev();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  if (totalChanges === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border bg-background/95 px-2 py-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrev}
        disabled={currentIndex <= 0}
        className="h-7 w-7 p-0"
        title="Previous change (p or Ctrl+↑)"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <div className="flex min-w-[80px] items-center justify-center gap-1 text-sm">
        <span className="font-semibold text-foreground">{currentIndex + 1}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{totalChanges}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        disabled={currentIndex >= totalChanges - 1}
        className="h-7 w-7 p-0"
        title="Next change (n or Ctrl+↓)"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

    </div>
  );
}
