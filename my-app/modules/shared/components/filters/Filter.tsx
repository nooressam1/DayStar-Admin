"use client";

import React from "react";
import { FilterBadge } from "./FilterBadge";
import { FilterDivider } from "./FilterDivider";
import { FilterSearch } from "./FilterSearch";
import { FilterRegistry, FilterConfig } from "./FilterRegistry";

export type { FilterConfig, FilterType } from "./FilterRegistry";
export type ViewMode = "grid" | "list";

export interface FilterBarConfigObject {
  showBadge?: boolean;
  badgeLabel?: string;
  badgeIcon?: React.ReactNode;
  showDivider?: boolean;
  filters?: FilterConfig[];
  actions?: React.ReactNode;
  className?: string;
}

export type FilterBarConfig = FilterConfig[] | FilterBarConfigObject;

export interface FilterProps {
  config?: FilterBarConfig;
  filters?: FilterConfig[];
  showBadge?: boolean;
  badgeLabel?: string;
  badgeIcon?: React.ReactNode;
  showDivider?: boolean;
  children?: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Filter({
  config,
  filters: filtersProp,
  showBadge = true,
  badgeLabel = "Filters",
  badgeIcon,
  showDivider = true,
  children,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  actions: actionsProp,
  className: classNameProp = "",
}: FilterProps) {
  // Normalize config if passed as array or object
  const isArrayConfig = Array.isArray(config);
  const configObject: FilterBarConfigObject = isArrayConfig
    ? { filters: config }
    : config || {};

  const effectiveFilters = configObject.filters || filtersProp || [];
  const effectiveShowBadge = configObject.showBadge ?? showBadge;
  const effectiveBadgeLabel = configObject.badgeLabel ?? badgeLabel;
  const effectiveBadgeIcon = configObject.badgeIcon ?? badgeIcon;
  const effectiveShowDivider = configObject.showDivider ?? showDivider;
  const effectiveActions = configObject.actions ?? actionsProp;
  const effectiveClassName = configObject.className || classNameProp;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] p-3 shadow-xs flex flex-wrap items-center gap-3 ${effectiveClassName}`}
    >
      {/* Filters Badge */}
      {effectiveShowBadge && (
        <FilterBadge label={effectiveBadgeLabel} icon={effectiveBadgeIcon} />
      )}

      {/* Vertical Divider */}
      {effectiveShowBadge && effectiveShowDivider && <FilterDivider />}

      {/* Declarative Config-driven Filters mapped via FilterRegistry */}
      {effectiveFilters.map((filter) => (
        <React.Fragment key={filter.key}>
          {FilterRegistry.render(filter)}
        </React.Fragment>
      ))}

      {/* Extra Children / Custom Elements */}
      {children}

      {/* Legacy Search Bar fallback if provided as explicit prop */}
      {onSearchChange !== undefined && (
        <FilterSearch
          value={searchQuery || ""}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      )}

      {/* Action Buttons Slot */}
      {effectiveActions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0 ml-auto">
          {effectiveActions}
        </div>
      )}
    </div>
  );
}

export default Filter;
