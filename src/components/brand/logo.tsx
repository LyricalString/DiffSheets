import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
  variant?: "dark" | "light" | "green";
}

/**
 * DiffSheets Logo Icon
 * Two overlapping sheets with highlighted intersection zone
 */
export function LogoIcon({ className, size = 48, variant = "dark" }: LogoIconProps) {
  // Color variants based on background
  const colors = {
    dark: {
      backSheet: "#3f3f46",
      frontSheet: "#22c55e",
      intersection: "#16a34a",
      intersectionOpacity: 0.6,
      lines: "#fafafa",
      linesOpacity: 0.9,
    },
    light: {
      backSheet: "#d4d4d8",
      frontSheet: "#22c55e",
      intersection: "#16a34a",
      intersectionOpacity: 0.4,
      lines: "#fafafa",
      linesOpacity: 0.9,
    },
    green: {
      backSheet: "rgba(255,255,255,0.3)",
      frontSheet: "#fafafa",
      intersection: "rgba(255,255,255,0.5)",
      intersectionOpacity: 1,
      lines: "#16a34a",
      linesOpacity: 1,
    },
  };

  const c = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-label="DiffSheets logo"
    >
      {/* Back sheet (original document) */}
      <rect x="6" y="4" width="28" height="36" rx="4" fill={c.backSheet} />
      {/* Front sheet (comparison document) */}
      <rect x="14" y="8" width="28" height="36" rx="4" fill={c.frontSheet} />
      {/* Intersection zone (overlap area) */}
      <rect
        x="14"
        y="8"
        width="20"
        height="32"
        rx="4"
        fill={c.intersection}
        fillOpacity={c.intersectionOpacity}
      />
      {/* Data lines representing spreadsheet content */}
      <rect
        x="18"
        y="14"
        width="12"
        height="3"
        rx="1"
        fill={c.lines}
        fillOpacity={c.linesOpacity}
      />
      <rect x="18" y="20" width="8" height="3" rx="1" fill={c.lines} fillOpacity={c.linesOpacity} />
      <rect
        x="18"
        y="26"
        width="10"
        height="3"
        rx="1"
        fill={c.lines}
        fillOpacity={c.linesOpacity}
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  iconSize?: number;
  variant?: "dark" | "light" | "green";
  showTagline?: boolean;
  tagline?: string;
}

/**
 * DiffSheets Full Logo with Text
 * Combines icon with wordmark "Diff" + "Sheets" (green)
 */
export function Logo({
  className,
  iconSize = 36,
  variant = "dark",
  showTagline = false,
  tagline,
}: LogoProps) {
  const textColor = variant === "light" ? "text-slate-900" : "text-slate-50";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoIcon size={iconSize} variant={variant} />
      <div className="flex flex-col">
        <span className={cn("font-display font-bold tracking-tight text-lg leading-tight", textColor)}>
          Diff<span className="text-green-500">Sheets</span>
        </span>
        {showTagline && tagline && (
          <span className="text-[11px] text-muted-foreground leading-tight">{tagline}</span>
        )}
      </div>
    </div>
  );
}
