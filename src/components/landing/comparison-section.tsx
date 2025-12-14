"use client";

import { DiffView } from "@/components/diff";
import { ComparisonUploader } from "@/components/upload";
import { useSpreadsheetStore } from "@/store";

export function ComparisonSection() {
  const { diffResult } = useSpreadsheetStore();

  return (
    <section id="compare" className="py-4" aria-label="File comparison tool">
      {diffResult ? (
        // DiffView uses full width for maximum comparison space
        <DiffView />
      ) : (
        // Uploader is centered with max-width for cleaner UI
        <div className="mx-auto max-w-5xl">
          <ComparisonUploader />
        </div>
      )}
    </section>
  );
}
