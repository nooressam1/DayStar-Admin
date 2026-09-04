"use client";

import React from "react";
import { FilterBadge } from "./FilterBadge";
import { FilterDivider } from "./FilterDivider";
import { FilterSearch } from "./FilterSearch";
import { FilterRegistry, FilterConfig } from "./FilterRegistry";

export type { FilterConfig, FilterType } from "./FilterRegistry";

export interface FilterBarProps {
  showBadge?: boolean;
  badgeLabel?: string;
  badgeIcon?: React.ReactNode;
  showDivider?: boolean;
  filters?: FilterConfig[];
  children?: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  showBadge = true,
  badgeLabel = "Filters",
  badgeIcon,
  showDivider = true,
  filters,
  children,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  actions,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] p-3 shadow-xs flex flex-wrap items-center gap-3 ${className}`}
    >
      {/* Filters Badge */}
      {showBadge && <FilterBadge label={badgeLabel} icon={badgeIcon} />}

      {/* Vertical Divider */}
      {showBadge && showDivider && <FilterDivider />}

      {/* Declarative Config-driven Filters via FilterRegistry */}
      {filters &&
        filters.map((filter) => (
          <React.Fragment key={filter.key}>
            {FilterRegistry.render(filter)}
          </React.Fragment>
        ))}

      {/* Extra Children / Custom Elements */}
      {children}

      {/* Search Bar Piece */}
      {onSearchChange !== undefined && (
        <FilterSearch
          value={searchQuery || ""}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      )}

      {/* Action Buttons Slot */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0 ml-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
