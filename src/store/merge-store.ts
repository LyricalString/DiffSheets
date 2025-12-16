import { create } from "zustand";
import type { MergeFileState, MergeMode, MergeOptions, MergeResult } from "@/types/merge";
import { defaultMergeOptions } from "@/types/merge";
import { parseSpreadsheet } from "@/lib/parser";

interface MergeStore {
  // File states
  files: MergeFileState[];

  // Options
  options: MergeOptions;

  // Result
  result: MergeResult | null;
  isProcessing: boolean;
  error: string | null;

  // Actions - Files
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  setFileSheet: (id: string, sheet: string) => void;
  clearAllFiles: () => void;

  // Actions - Options
  setOptions: (options: Partial<MergeOptions>) => void;
  setMode: (mode: MergeMode) => void;

  // Actions - Merge
  executeMerge: () => Promise<void>;
  downloadResult: () => Promise<void>;
  reset: () => void;
}

/**
 * Generate a unique ID for a file
 */
function generateId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useMergeStore = create<MergeStore>((set, get) => ({
  // Initial state
  files: [],
  options: { ...defaultMergeOptions },
  result: null,
  isProcessing: false,
  error: null,

  // Add multiple files
  addFiles: async (newFiles: File[]) => {
    const currentFiles = get().files;
    const startOrder = currentFiles.length;

    // Create initial file states
    const fileStates: MergeFileState[] = newFiles.map((file, index) => ({
      id: generateId(),
      file,
      parsed: null,
      selectedSheet: "",
      isLoading: true,
      error: null,
      order: startOrder + index,
    }));

    // Add files to state immediately (showing loading)
    set((state) => ({
      files: [...state.files, ...fileStates],
      result: null,
      error: null,
    }));

    // Parse each file
    for (const fileState of fileStates) {
      try {
        const parsed = await parseSpreadsheet(fileState.file!);

        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileState.id
              ? {
                  ...f,
                  parsed,
                  selectedSheet: parsed.sheets[0]?.name || "",
                  isLoading: false,
                }
              : f,
          ),
        }));
      } catch (error) {
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileState.id
              ? {
                  ...f,
                  isLoading: false,
                  error: error instanceof Error ? error.message : "Failed to parse file",
                }
              : f,
          ),
        }));
      }
    }
  },

  // Remove a file
  removeFile: (id: string) => {
    set((state) => {
      const filteredFiles = state.files.filter((f) => f.id !== id);
      // Reorder remaining files
      const reorderedFiles = filteredFiles.map((f, index) => ({
        ...f,
        order: index,
      }));
      return {
        files: reorderedFiles,
        result: null,
      };
    });
  },

  // Reorder files (for drag and drop)
  reorderFiles: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const files = [...state.files];
      const [movedFile] = files.splice(fromIndex, 1);
      files.splice(toIndex, 0, movedFile);

      // Update order property
      const reorderedFiles = files.map((f, index) => ({
        ...f,
        order: index,
      }));

      return {
        files: reorderedFiles,
        result: null,
      };
    });
  },

  // Set selected sheet for a file
  setFileSheet: (id: string, sheet: string) => {
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, selectedSheet: sheet } : f)),
      result: null,
    }));
  },

  // Clear all files
  clearAllFiles: () => {
    set({
      files: [],
      result: null,
      error: null,
    });
  },

  // Set merge options
  setOptions: (newOptions: Partial<MergeOptions>) => {
    set((state) => ({
      options: { ...state.options, ...newOptions },
      result: null,
    }));
  },

  // Set merge mode
  setMode: (mode: MergeMode) => {
    set((state) => ({
      options: { ...state.options, mode },
      result: null,
    }));
  },

  // Execute merge
  executeMerge: async () => {
    const { files, options } = get();

    // Validate
    const validFiles = files.filter((f) => f.parsed && f.selectedSheet && !f.error);
    if (validFiles.length < 2) {
      set({ error: "At least 2 valid files are required" });
      return;
    }

    set({ isProcessing: true, error: null });

    try {
      const { mergeSpreadsheets } = await import("@/lib/merge");
      const result = await mergeSpreadsheets(validFiles, options);
      set({ result, isProcessing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Merge failed",
        isProcessing: false,
      });
    }
  },

  // Download result
  downloadResult: async () => {
    const { result, options } = get();

    if (!result) {
      set({ error: "No result to download" });
      return;
    }

    try {
      const { exportWorkbook } = await import("@/lib/merge/export");
      await exportWorkbook(result.workbook, options.outputFilename);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Download failed",
      });
    }
  },

  // Reset everything
  reset: () => {
    set({
      files: [],
      options: { ...defaultMergeOptions },
      result: null,
      isProcessing: false,
      error: null,
    });
  },
}));
