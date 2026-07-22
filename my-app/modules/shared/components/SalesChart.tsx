"use client";

import React, { useState } from "react";

export interface SalesChartItem {
  day: string;
  value: number;
  label?: string;
  isHighlighted?: boolean;
}

export interface SalesChartProps {
  title?: string;
  legendLabel?: string;
  data?: SalesChartItem[];
  className?: string;
}

const defaultChartData: SalesChartItem[] = [
  { day: "Mon", value: 55, label: "55 Orders" },
  { day: "Tue", value: 80, label: "80 Orders" },
  { day: "Wed", value: 95, label: "95 Orders", isHighlighted: true },
  { day: "Thu", value: 42, label: "42 Orders" },
  { day: "Fri", value: 65, label: "65 Orders" },
  { day: "Sat", value: 50, label: "50 Orders" },
  { day: "Sun", value: 85, label: "85 Orders" },
];

export function SalesChart({
  title = "Sales Performance",
  legendLabel = "Orders",
  data = defaultChartData,
  className = "",
}: SalesChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
        <h3 className="text-base font-bold text-[#3D2E28]">{title}</h3>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8C766E]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#754E45]" />
          <span>{legendLabel}</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="pt-8 pb-2">
        <div className="h-64 flex items-end justify-between gap-3 px-2 sm:px-6">
          {data.map((item, index) => {
            const heightPercent = Math.round((item.value / maxValue) * 100);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 bg-[#3D2E28] text-white text-xs px-2.5 py-1 rounded-lg font-medium shadow-md whitespace-nowrap z-10 transition-all">
                    {item.label || `${item.value} ${legendLabel}`}
                  </div>
                )}

                {/* Bar */}
                <div
                  className={`w-full max-w-[56px] rounded-t-2xl transition-all duration-300 ${
                    item.isHighlighted
                      ? "bg-[#754E45] group-hover:bg-[#603D35]"
                      : "bg-[#EBE3DE] group-hover:bg-[#DFCFC5]"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Day Label */}
                <span
                  className={`text-xs sm:text-sm font-medium mt-4 transition-colors ${
                    item.isHighlighted || isHovered
                      ? "text-[#3D2E28] font-semibold"
                      : "text-[#8C766E]"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
