"use client";

import { Columns2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "unified" | "side-by-side";

interface ViewModeSelectorProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const modes: { value: ViewMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "side-by-side",
    label: "Side by Side",
    icon: <Columns2 className="h-4 w-4" />,
    description: "Compare files in parallel",
  },
  {
    value: "unified",
    label: "Unified",
    icon: <Layers className="h-4 w-4" />,
    description: "Merged view with changes stacked",
  },
];

export function ViewModeSelector({ mode, onChange, className }: ViewModeSelectorProps) {
  return (
    <div className={cn("inline-flex items-center rounded-lg bg-muted p-1", className)}>
      {modes.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            mode === m.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50",
          )}
          title={m.description}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
          {mode === m.value && (
            <span
              className="absolute inset-0 rounded-md ring-2 ring-primary/20"
              style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
