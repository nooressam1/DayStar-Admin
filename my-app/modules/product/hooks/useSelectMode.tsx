"use client";

import { useState, useCallback } from "react";

export interface UseSelectModeOptions {
  initialIsSelectMode?: boolean;
  initialSelectedIds?: string[];
}

export function useSelectMode(options: UseSelectModeOptions = {}) {
  const [isSelectMode, setIsSelectMode] = useState<boolean>(
    options.initialIsSelectMode ?? false
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    options.initialSelectedIds ?? []
  );

  const turnOnSelect = useCallback(() => {
    setIsSelectMode(true);
  }, []);

  const turnOffSelect = useCallback(() => {
    setIsSelectMode(false);
    setSelectedIds([]);
  }, []);

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedIds([]);
      }
      return !prev;
    });
  }, []);

  const handleSelectToggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);


  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return {
    isSelectMode,
    setIsSelectMode,
    selectedIds,
    setSelectedIds,
    selectedCount: selectedIds.length,
    turnOnSelect,

    turnOffSelect,
    toggleSelectMode,
    handleSelectToggle,
    selectAll,
    clearSelection,
    isSelected,
  };
}
