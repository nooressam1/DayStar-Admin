import React from "react";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF5F2]">
      <Navbar />
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  );
}
