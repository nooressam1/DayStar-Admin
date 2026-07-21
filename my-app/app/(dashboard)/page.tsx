import React from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { SalesChart } from "@/components/SalesChart";
import { RecentOrdersTable } from "@/components/RecentOrdersTable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#6E4B42]">Dashboard</h1>
        <p className="text-sm text-[#8A756C] mt-1">
          Welcome back. Here's what's happening with your store today.
        </p>
      </div>

      {/* Metrics Overview Component */}
      <DashboardStats />

      {/* Sales Performance Chart Component */}
      <SalesChart />

      {/* Recent Orders Table Component */}
      <RecentOrdersTable />
    </div>
  );
}
