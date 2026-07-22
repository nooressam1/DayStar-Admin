"use client";

import React from "react";
import { StatCard } from "./StatCard";

export interface SalesStat {
  title: string;
  value: string;
  change: string;
  showSparkline?: boolean;
}

export interface OrdersStat {
  title: string;
  value: string;
  percentage: number;
}

export interface LowStockStat {
  title: string;
  value: string;
  linkText: string;
  linkHref: string;
}

export interface SimpleStat {
  title: string;
  value: string;
}

export interface DashboardStatsProps {
  salesData?: SalesStat;
  ordersData?: OrdersStat;
  lowStockData?: LowStockStat;
  newCustomersData?: SimpleStat;
  className?: string;
}

export function DashboardStats({
  salesData = {
    title: "TOTAL SALES",
    value: "$128,430.00",
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
    linkText: "Review Inventory",
    linkHref: "/inventory",
  },
  newCustomersData = {
    title: "NEW CUSTOMERS",
    value: "+158",
  },
  className = "",
}: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Sales */}
      <StatCard
        title={salesData.title}
        value={salesData.value}
        change={salesData.change}
        showSparkline={salesData.showSparkline ?? true}
      />

      {/* Active Orders */}
      <StatCard
        title={ordersData.title}
        value={ordersData.value}
        progressPercentage={ordersData.percentage}
      />

      {/* Low Stock */}
      <StatCard
        title={lowStockData.title}
        value={lowStockData.value}
        actionLink={{
          text: lowStockData.linkText,
          href: lowStockData.linkHref,
        }}
      />

      {/* New Customers */}
      <StatCard
        title={newCustomersData.title}
        value={newCustomersData.value}
      />
    </div>
  );
}

export default DashboardStats;
