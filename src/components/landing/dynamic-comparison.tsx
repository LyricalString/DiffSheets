"use client";

import dynamic from "next/dynamic";

// Dynamically import the interactive uploader - this reduces initial JS bundle
export const DynamicComparisonSection = dynamic(
  () => import("@/components/landing/comparison-section").then((mod) => mod.ComparisonSection),
  {
    loading: () => (
      <div className="mx-auto max-w-5xl py-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-44 animate-pulse rounded-2xl border-2 border-dashed border-border bg-muted/50" />
          <div className="h-44 animate-pulse rounded-2xl border-2 border-dashed border-border bg-muted/50" />
        </div>
      </div>
    ),
    ssr: false,
  },
);
