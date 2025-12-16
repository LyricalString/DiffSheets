"use client";

import dynamic from "next/dynamic";

// Dynamically import the merge uploader - reduces initial JS bundle
export const DynamicMergeSection = dynamic(
  () => import("@/components/merge").then((mod) => mod.MergeUploader),
  {
    loading: () => (
      <div className="mx-auto max-w-3xl py-4">
        <div className="h-52 animate-pulse rounded-2xl border-2 border-dashed border-border bg-muted/50" />
      </div>
    ),
    ssr: false,
  },
);
