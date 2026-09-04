"use client";

import React from "react";
import { StatCard } from "./StatCard";

export interface SalesStat {
  title?: string;
  value: string;
  change?: string;
  showSparkline?: boolean;
}

export interface OrdersStat {
  title?: string;
  value: string;
  percentage?: number;
}

export interface LowStockStat {
  title?: string;
  value: string;
  linkText?: string;
  linkHref?: string;
}

export interface SimpleStat {
  title?: string;
  value: string;
}

export interface DashboardStatsProps {
  salesData?: SalesStat;
  ordersData?: OrdersStat;
  lowStockData?: LowStockStat;
  newCustomersData?: SimpleStat;
  isLoading?: boolean;
  className?: string;
}

export function DashboardStats({
  salesData = {
    title: "TOTAL SALES",
    value: "EGP 128,430.00",
    change: "+12.5%",
    showSparkline: true,
  },
  ordersData = {
    title: "ACTIVE ORDERS",
    value: "1,240",
    percentage: 75,
  },
  lowStockData = {
    title: "LOW STOCK",
    value: "24 Items",
  },
  newCustomersData = {
    title: "NEW CUSTOMERS",
    value: "+158",
  },
  isLoading = false,
  className = "",
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-[#E9E3DE] shadow-xs flex flex-col justify-between min-h-[128px] animate-pulse"
          >
            <div>
              <div className="w-24 h-3 bg-stone-200 rounded mb-2" />
              <div className="w-32 h-7 bg-stone-200 rounded" />
            </div>
            <div className="w-20 h-4 bg-stone-200 rounded mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Sales */}
      <StatCard
        title={salesData.title || "TOTAL SALES"}
        value={salesData.value}
        change={salesData.change}
        showSparkline={salesData.showSparkline ?? true}
      />

      {/* Active Orders */}
      <StatCard
        title={ordersData.title || "ACTIVE ORDERS"}
        value={ordersData.value}
        progressPercentage={ordersData.percentage}
      />

      {/* Low Stock */}
      <StatCard
        title={lowStockData.title || "LOW STOCK"}
        value={lowStockData.value}

      />

      {/* New Customers */}
      <StatCard
        title={newCustomersData.title || "NEW CUSTOMERS"}
        value={newCustomersData.value}
      />
    </div>
  );
}

export default DashboardStats;
