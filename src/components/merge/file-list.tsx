"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { MergeFileCard } from "./merge-file-card";
import type { MergeFileState } from "@/types/merge";

interface FileListProps {
  files: MergeFileState[];
  onRemove: (id: string) => void;
  onSheetChange: (id: string, sheet: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function FileList({ files, onRemove, onSheetChange, onReorder }: FileListProps) {
  const t = useTranslations("merge");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [draggedIndex],
  );

  const handleDrop = useCallback(
    (index: number) => {
      if (draggedIndex !== null && draggedIndex !== index) {
        onReorder(draggedIndex, index);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  if (files.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t("fileList.empty")}</p>
      </div>
    );
  }

  // Sort files by order
  const sortedFiles = [...files].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-sm">
          {t("fileList.title")} ({files.length})
        </p>
        <p className="text-muted-foreground text-xs">{t("fileList.reorderHint")}</p>
      </div>

      <div className="space-y-2">
        {sortedFiles.map((file, index) => (
          <div
            key={file.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`transition-transform ${
              dragOverIndex === index ? "translate-y-1" : ""
            }`}
          >
            <MergeFileCard
              file={file}
              index={index}
              onRemove={() => onRemove(file.id)}
              onSheetChange={(sheet) => onSheetChange(file.id, sheet)}
              isDragging={draggedIndex === index}
              dragHandleProps={{
                onMouseDown: (e) => e.stopPropagation(),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
