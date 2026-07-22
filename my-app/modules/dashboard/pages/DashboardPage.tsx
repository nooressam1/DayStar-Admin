"use client";

import React from "react";
import {
  PageHeader,
  DashboardStats,
  SalesChart,
  RecentOrdersTable,
} from "@/modules/shared";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening with your store today."
      />

      {/* Metrics Overview Component */}
      <DashboardStats />

      {/* Sales Performance Chart Component */}
      <SalesChart />

      {/* Recent Orders Table Component */}
      <RecentOrdersTable />
    </div>
  );
}

export default DashboardPage;
