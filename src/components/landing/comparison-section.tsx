"use client";

import { DiffView } from "@/components/diff";
import { ComparisonUploader } from "@/components/upload";
import { useSpreadsheetStore } from "@/store";

export function ComparisonSection() {
  const { diffResult } = useSpreadsheetStore();

  return (
    <section id="compare" className="mx-auto max-w-4xl py-8" aria-label="File comparison tool">
      {diffResult ? <DiffView /> : <ComparisonUploader />}
    </section>
  );
}
