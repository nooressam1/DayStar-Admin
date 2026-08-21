import React from "react";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#FAF5F2] flex items-center justify-center p-6 font-sans antialiased text-[#6E4B42]">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-[#6E4B42]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 bg-white/90 backdrop-blur-md border border-[#EAE1DA] p-8 sm:p-10 rounded-2xl shadow-sm flex flex-col items-center">
        {/* Brand header */}
        <span className="text-xs font-semibold tracking-widest uppercase text-[#8A756C] mb-4">
          DayStar Admin Portal
        </span>

        {/* 404 Display */}
        <h1 className="font-serif text-7xl sm:text-8xl font-bold text-[#6E4B42] leading-none mb-2">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="font-serif text-2xl font-normal text-[#4A322C] mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-[#8A756C] max-w-sm mb-8 leading-relaxed">
          The admin section or resource you requested does not exist, has been removed, or moved elsewhere.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#6E4B42] hover:bg-[#583B34] text-white font-medium text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/order"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FAF5F2] hover:bg-[#EFE6E0] text-[#6E4B42] border border-[#EAE1DA] font-medium text-sm rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Orders</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-[#EAE1DA] w-full flex justify-center gap-4 text-xs text-[#8A756C]">
          <Link href="/product" className="hover:text-[#6E4B42] transition-colors">
            Products
          </Link>
          <span>•</span>
          <Link href="/customer" className="hover:text-[#6E4B42] transition-colors">
            Customers
          </Link>
          <span>•</span>
          <Link href="/inventory" className="hover:text-[#6E4B42] transition-colors">
            Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
