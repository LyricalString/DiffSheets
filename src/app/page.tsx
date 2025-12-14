"use client";

import { Header, Footer } from "@/components/layout";
import { ComparisonUploader } from "@/components/upload";
import { DiffView } from "@/components/diff";
import { useSpreadsheetStore } from "@/store";

export default function Home() {
  const { diffResult } = useSpreadsheetStore();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {diffResult ? <DiffView /> : <ComparisonUploader />}
      </main>
      <Footer />
    </div>
  );
}
