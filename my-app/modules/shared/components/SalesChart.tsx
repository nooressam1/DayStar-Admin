"use client";

import React, { useState, useMemo } from "react";

export interface SalesChartItem {
  day: string;
  value: number;
  secondaryValue?: number;
  label?: string;
  subLabel?: string;
  isHighlighted?: boolean;
}

export interface SalesChartProps {
  title?: string;
  legendLabel?: string;
  data?: SalesChartItem[];
  isLoading?: boolean;
  activeMetric?: "revenue" | "orders";
  onMetricChange?: (metric: "revenue" | "orders") => void;
  className?: string;
}

const defaultChartData: SalesChartItem[] = [
  { day: "Mon", value: 550000, secondaryValue: 55, label: "EGP 5,500.00", subLabel: "55 Orders" },
  { day: "Tue", value: 800000, secondaryValue: 80, label: "EGP 8,000.00", subLabel: "80 Orders" },
  { day: "Wed", value: 950000, secondaryValue: 95, label: "EGP 9,500.00", subLabel: "95 Orders", isHighlighted: true },
  { day: "Thu", value: 420000, secondaryValue: 42, label: "EGP 4,200.00", subLabel: "42 Orders" },
  { day: "Fri", value: 650000, secondaryValue: 65, label: "EGP 6,500.00", subLabel: "65 Orders" },
  { day: "Sat", value: 500000, secondaryValue: 50, label: "EGP 5,000.00", subLabel: "50 Orders" },
  { day: "Sun", value: 850000, secondaryValue: 85, label: "EGP 8,500.00", subLabel: "85 Orders" },
];

export function SalesChart({
  title = "Sales Performance",
  legendLabel,
  data = defaultChartData,
  isLoading = false,
  activeMetric: propMetric,
  onMetricChange,
  className = "",
}: SalesChartProps) {
  const [internalMetric, setInternalMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentMetric = propMetric || internalMetric;

  const handleMetricToggle = (metric: "revenue" | "orders") => {
    setInternalMetric(metric);
    onMetricChange?.(metric);
  };

  const chartItems = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Find maximum value to highlight peak
    const values = data.map((item) =>
      currentMetric === "orders" && item.secondaryValue !== undefined
        ? item.secondaryValue
        : item.value
    );
    const maxVal = Math.max(...values, 1);

    return data.map((item) => {
      const val = currentMetric === "orders" && item.secondaryValue !== undefined
        ? item.secondaryValue
        : item.value;

      const isMax = val > 0 && val === maxVal;
      
      return {
        ...item,
        currentValue: val,
        isPeak: item.isHighlighted ?? isMax,
      };
    });
  }, [data, currentMetric]);

  const maxValue = Math.max(...chartItems.map((item) => item.currentValue), 1);

  const effectiveLegendLabel = legendLabel || (currentMetric === "revenue" ? "Revenue (EGP)" : "Orders Count");

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs ${className}`}>
      {/* Header with Title & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3DE]">
        <div>
          <h3 className="text-base font-bold text-[#3D2E28]">{title}</h3>
          <p className="text-xs text-[#8C766E] mt-0.5">Overview of daily store revenue & order volume</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Legend Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#8C766E] mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#754E45]" />
            <span>{effectiveLegendLabel}</span>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center p-1 bg-[#FAF5F2] border border-[#E9E3DE] rounded-xl text-xs font-semibold">
            <button
              onClick={() => handleMetricToggle("revenue")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentMetric === "revenue"
                  ? "bg-[#754E45] text-white shadow-xs"
                  : "text-[#6E5B53] hover:text-[#3D2E28]"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => handleMetricToggle("orders")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentMetric === "orders"
                  ? "bg-[#754E45] text-white shadow-xs"
                  : "text-[#6E5B53] hover:text-[#3D2E28]"
              }`}
            >
              Orders
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="pt-8 pb-2">
        {isLoading ? (
          <div className="h-64 flex items-end justify-between gap-3 px-2 sm:px-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end animate-pulse">
                <div
                  className="w-full max-w-[56px] rounded-t-2xl bg-stone-200"
                  style={{ height: `${[40, 65, 90, 35, 75, 50, 85][i]}%` }}
                />
                <div className="w-8 h-4 bg-stone-200 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between gap-3 px-2 sm:px-6">
            {chartItems.map((item, index) => {
              const heightPercent = Math.round((item.currentValue / maxValue) * 100);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Peak Day Badge */}
                  {item.isPeak && !isHovered && (
                    <div className="absolute -top-7 text-[10px] font-bold text-[#754E45] bg-[#754E45]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Peak
                    </div>
                  )}

                  {/* Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-14 bg-[#3D2E28] text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-lg whitespace-nowrap z-20 transition-all flex flex-col items-center gap-0.5 animate-fadeIn">
                      <span className="font-semibold text-amber-200">
                        {item.label || `${item.currentValue}`}
                      </span>
                      {item.subLabel && (
                        <span className="text-[11px] text-stone-300">
                          {item.subLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bar with gradient animation */}
                  <div
                    className={`w-full max-w-[56px] rounded-t-2xl transition-all duration-300 relative overflow-hidden ${
                      item.isPeak
                        ? "bg-gradient-to-t from-[#603D35] to-[#754E45] group-hover:from-[#4E302A] group-hover:to-[#603D35] shadow-sm"
                        : "bg-[#EBE3DE] group-hover:bg-[#DFCFC5]"
                    }`}
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  />

                  {/* Day Label */}
                  <span
                    className={`text-xs sm:text-sm font-medium mt-4 transition-colors ${
                      item.isPeak || isHovered
                        ? "text-[#3D2E28] font-bold"
                        : "text-[#8C766E]"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesChart;
