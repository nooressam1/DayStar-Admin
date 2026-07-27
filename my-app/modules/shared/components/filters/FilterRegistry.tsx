"use client";

import React from "react";
import { FilterOption, FilterSelect } from "./FilterSelect";
import { FilterDate } from "./FilterDate";
import { FilterDateRange } from "./FilterDateRange";
import { FilterInput } from "./FilterInput";
import { FilterSearch } from "./FilterSearch";
import { FilterBadge } from "./FilterBadge";
import { FilterDivider } from "./FilterDivider";
import { FilterTabs } from "./FilterTabs";

export type FilterType =
  | "select"
  | "date"
  | "date-range"
  | "tabs"
  | "text"
  | "search"
  | "badge"
  | "divider"
  | "custom"
  | (string & {});

export interface FilterConfig {
  key: string;
  type?: FilterType;
  label?: string;
  placeholder?: string;
  options?: FilterOption[];
  value?: string;
  defaultValue?: string;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onChange?: (value: string) => void;
  render?: (config: FilterConfig) => React.ReactNode;
  className?: string;
}

export type FilterComponentRenderer = (config: FilterConfig) => React.ReactNode;

export class FilterRegistryClass {
  private registry = new Map<string, FilterComponentRenderer>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    // Select filter renderer
    this.register("select", (filter) => (
      <FilterSelect
        key={filter.key}
        value={filter.value ?? filter.defaultValue ?? ""}
        onValueChange={filter.onChange}
        options={filter.options}
        className={filter.className}
      />
    ));

    // Tabs filter renderer
    this.register("tabs", (filter) => (
      <FilterTabs
        key={filter.key}
        value={filter.value ?? filter.defaultValue ?? ""}
        onChange={filter.onChange}
        options={filter.options || []}
        className={filter.className}
      />
    ));

    // Single Date filter renderer
    this.register("date", (filter) => (
      <FilterDate
        key={filter.key}
        value={filter.value ?? filter.defaultValue ?? ""}
        onValueChange={filter.onChange}
        placeholder={filter.placeholder || filter.label}
        className={filter.className}
      />
    ));

    // Date Range filter renderer
    this.register("date-range", (filter) => (
      <FilterDateRange
        key={filter.key}
        startDate={filter.startDate}
        onStartDateChange={filter.onStartDateChange}
        endDate={filter.endDate}
        onEndDateChange={filter.onEndDateChange}
        className={filter.className}
      />
    ));

    // Text Input filter renderer
    this.register("text", (filter) => (
      <FilterInput
        key={filter.key}
        type="text"
        value={filter.value ?? filter.defaultValue ?? ""}
        onValueChange={filter.onChange}
        placeholder={filter.placeholder || filter.label}
        className={filter.className}
      />
    ));

    // Search filter renderer
    this.register("search", (filter) => (
      <FilterSearch
        key={filter.key}
        value={filter.value ?? filter.defaultValue ?? ""}
        onSearchChange={filter.onChange}
        placeholder={filter.placeholder || filter.label}
        className={filter.className}
      />
    ));

    // Badge filter renderer
    this.register("badge", (filter) => (
      <FilterBadge
        key={filter.key}
        label={filter.label}
        className={filter.className}
      />
    ));

    // Divider filter renderer
    this.register("divider", (filter) => (
      <FilterDivider key={filter.key} className={filter.className} />
    ));
  }

  /**
   * Register a new filter component type renderer.
   */
  public register(type: string, renderer: FilterComponentRenderer): void {
    this.registry.set(type, renderer);
  }

  /**
   * Unregister a filter component type renderer.
   */
  public unregister(type: string): boolean {
    return this.registry.delete(type);
  }

  /**
   * Get a registered filter renderer for a given filter type.
   */
  public get(type: string): FilterComponentRenderer | undefined {
    return this.registry.get(type);
  }

  /**
   * Render a filter item based on its configuration object.
   */
  public render(filter: FilterConfig): React.ReactNode {
    if (filter.type === "custom" && filter.render) {
      return (
        <React.Fragment key={filter.key}>
          {filter.render(filter)}
        </React.Fragment>
      );
    }

    const type = filter.type || "select";
    const renderer = this.get(type);

    if (renderer) {
      return renderer(filter);
    }

    // Default fallback to select
    return (
      <FilterSelect
        key={filter.key}
        value={filter.value ?? filter.defaultValue ?? ""}
        onValueChange={filter.onChange}
        options={filter.options}
        className={filter.className}
      />
    );
  }
}

export const FilterRegistry = new FilterRegistryClass();

export default FilterRegistry;
