import { create } from "zustand";
import type { ComparisonOptions, DiffResult, FileUploadState, ParsedSpreadsheet } from "@/types";
import { defaultComparisonOptions } from "@/types";

interface SpreadsheetStore {
  // File states
  originalFile: FileUploadState;
  modifiedFile: FileUploadState;

  // Diff state
  diffResult: DiffResult | null;
  isComparing: boolean;
  comparisonError: string | null;
  comparisonVersion: number; // Used for cancellation

  // Options
  options: ComparisonOptions;

  // Actions - Original file
  setOriginalFile: (file: File | null) => void;
  setOriginalParsed: (parsed: ParsedSpreadsheet | null) => void;
  setOriginalSheet: (sheet: string) => void;
  setOriginalHeaderRow: (row: number) => void;
  setOriginalLoading: (loading: boolean) => void;
  setOriginalError: (error: string | null) => void;

  // Actions - Modified file
  setModifiedFile: (file: File | null) => void;
  setModifiedParsed: (parsed: ParsedSpreadsheet | null) => void;
  setModifiedSheet: (sheet: string) => void;
  setModifiedHeaderRow: (row: number) => void;
  setModifiedLoading: (loading: boolean) => void;
  setModifiedError: (error: string | null) => void;

  // Actions - Diff
  setDiffResult: (result: DiffResult | null) => void;
  setIsComparing: (comparing: boolean) => void;
  setComparisonError: (error: string | null) => void;

  // Actions - Options
  setOptions: (options: Partial<ComparisonOptions>) => void;

  // Actions - Reset
  reset: () => void;
  resetOriginal: () => void;
  resetModified: () => void;

  // Actions - Recompare
  recompare: () => Promise<void>;
}

const initialFileState: FileUploadState = {
  file: null,
  parsed: null,
  selectedSheet: "",
  headerRow: 1,
  isLoading: false,
  error: null,
};

export const useSpreadsheetStore = create<SpreadsheetStore>((set) => ({
  // Initial states
  originalFile: { ...initialFileState },
  modifiedFile: { ...initialFileState },
  diffResult: null,
  isComparing: false,
  comparisonError: null,
  comparisonVersion: 0,
  options: { ...defaultComparisonOptions },

  // Original file actions
  setOriginalFile: (file) =>
    set((state) => ({
      originalFile: { ...state.originalFile, file },
      diffResult: null,
    })),
  setOriginalParsed: (parsed) =>
    set((state) => ({
      originalFile: {
        ...state.originalFile,
        parsed,
        selectedSheet: parsed?.sheets[0]?.name || "",
      },
      diffResult: null,
    })),
  setOriginalSheet: (sheet) =>
    set((state) => ({
      originalFile: { ...state.originalFile, selectedSheet: sheet },
      diffResult: null,
    })),
  setOriginalHeaderRow: (row) =>
    set((state) => ({
      originalFile: { ...state.originalFile, headerRow: row },
      diffResult: null,
    })),
  setOriginalLoading: (isLoading) =>
    set((state) => ({
      originalFile: { ...state.originalFile, isLoading },
    })),
  setOriginalError: (error) =>
    set((state) => ({
      originalFile: { ...state.originalFile, error },
    })),

  // Modified file actions
  setModifiedFile: (file) =>
    set((state) => ({
      modifiedFile: { ...state.modifiedFile, file },
      diffResult: null,
    })),
  setModifiedParsed: (parsed) =>
    set((state) => ({
      modifiedFile: {
        ...state.modifiedFile,
        parsed,
        selectedSheet: parsed?.sheets[0]?.name || "",
      },
      diffResult: null,
    })),
  setModifiedSheet: (sheet) =>
    set((state) => ({
      modifiedFile: { ...state.modifiedFile, selectedSheet: sheet },
      diffResult: null,
    })),
  setModifiedHeaderRow: (row) =>
    set((state) => ({
      modifiedFile: { ...state.modifiedFile, headerRow: row },
      diffResult: null,
    })),
  setModifiedLoading: (isLoading) =>
    set((state) => ({
      modifiedFile: { ...state.modifiedFile, isLoading },
    })),
  setModifiedError: (error) =>
    set((state) => ({
      modifiedFile: { ...state.modifiedFile, error },
    })),

  // Diff actions
  setDiffResult: (diffResult) => set({ diffResult }),
  setIsComparing: (isComparing) => set({ isComparing }),
  setComparisonError: (comparisonError) => set({ comparisonError }),

  // Options actions
  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),

  // Reset actions
  reset: () =>
    set({
      originalFile: { ...initialFileState },
      modifiedFile: { ...initialFileState },
      diffResult: null,
      isComparing: false,
      comparisonError: null,
      options: { ...defaultComparisonOptions },
    }),
  resetOriginal: () =>
    set({
      originalFile: { ...initialFileState },
      diffResult: null,
    }),
  resetModified: () =>
    set({
      modifiedFile: { ...initialFileState },
      diffResult: null,
    }),

  // Recompare with current options (supports cancellation via version check)
  recompare: async () => {
    const currentState = useSpreadsheetStore.getState();
    console.log("[DEBUG] recompare called, options:", {
      ignoredColumns: currentState.options.ignoredColumns,
      matchingStrategy: currentState.options.matchingStrategy,
    });

    const origData = currentState.originalFile.parsed?.data.get(
      currentState.originalFile.selectedSheet,
    );
    const modData = currentState.modifiedFile.parsed?.data.get(
      currentState.modifiedFile.selectedSheet,
    );

    if (!origData || !modData) {
      set({ comparisonError: "Missing sheet data" });
      return;
    }

    // Increment version to cancel any ongoing comparison
    const newVersion = currentState.comparisonVersion + 1;
    set({ isComparing: true, comparisonError: null, comparisonVersion: newVersion });

    try {
      const { computeSpreadsheetDiff } = await import("@/lib/diff");

      // Use setTimeout to yield to main thread before heavy computation
      await new Promise((resolve) => setTimeout(resolve, 0));

      const optionsForCompare = useSpreadsheetStore.getState().options;
      console.log("[DEBUG] computeSpreadsheetDiff with options:", {
        ignoredColumns: optionsForCompare.ignoredColumns,
      });

      const result = await computeSpreadsheetDiff(
        origData,
        modData,
        optionsForCompare,
      );

      // Check if this comparison is still current (not cancelled)
      const latestState = useSpreadsheetStore.getState();
      if (latestState.comparisonVersion === newVersion) {
        console.log("[DEBUG] diff result summary:", result.summary);
        set({ diffResult: result, isComparing: false });
      }
      // If version doesn't match, another comparison started - don't update state
    } catch (error) {
      // Only set error if this comparison is still current
      const latestState = useSpreadsheetStore.getState();
      if (latestState.comparisonVersion === newVersion) {
        set({
          comparisonError: error instanceof Error ? error.message : "Comparison failed",
          isComparing: false,
        });
      }
    }
  },
}));
