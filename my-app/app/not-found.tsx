"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF5F2] flex items-center justify-center p-6 font-sans antialiased text-[#583F37] relative overflow-hidden selection:bg-[#004956] selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#004956]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#78534A]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 bg-white/95 backdrop-blur-xl border border-[#E9E3DE] p-8 sm:p-12 rounded-3xl shadow-lg shadow-[#004956]/5 flex flex-col items-center">
        {/* Brand Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF5F2] border border-[#E9E3DE] mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#004956] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#78534A]">
            DayStar Admin Portal
          </span>
        </div>

        {/* 404 Large Display */}
        <div className="relative mb-4">
          <span className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-[#004956]/10 select-none block">
            404
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2924] absolute inset-0 flex items-center justify-center">
            Page Not Found
          </h1>
        </div>

        {/* Descriptive Message */}
        <p className="text-sm sm:text-base text-[#8A756C] max-w-md mb-8 leading-relaxed">
          The admin section, resource, or ID you requested doesn’t exist, has been archived, or moved elsewhere.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-8">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#004956] hover:bg-[#003842] text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <svg
              className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Back to Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF5F2] hover:bg-[#F2ECE8] text-[#583F37] border border-[#E9E3DE] font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Portal Navigation Grid */}
        <div className="w-full pt-6 border-t border-[#E9E3DE]">
          <p className="text-xs font-semibold text-[#8A756C] uppercase tracking-wider mb-4">
            Quick Navigation
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
            <Link
              href="/order"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Orders</span>
            </Link>

            <Link
              href="/product"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Products</span>
            </Link>

            <Link
              href="/category"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Categories</span>
            </Link>

            <Link
              href="/customer"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Customers</span>
            </Link>

            <Link
              href="/discount"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Discounts</span>
            </Link>

            <Link
              href="/query"
              className="px-3.5 py-2.5 bg-[#FAF5F2]/70 hover:bg-[#FAF5F2] border border-[#E9E3DE] hover:border-[#004956]/40 rounded-xl text-xs font-semibold text-[#583F37] hover:text-[#004956] flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Queries</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
