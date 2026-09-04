'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/modules/shared";
import { clearAuthData } from "@/utils/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await clearAuthData();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#FAF5F2]">
      <Navbar onLogout={handleLogout} />
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  );
}
