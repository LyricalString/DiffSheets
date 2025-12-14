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
}));
