"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/order",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/product",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: "Customers",
    href: "/customer",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Category",
    href: "/category",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: "Discount",
    href: "/discount",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    label: "Queries",
    href: "/query",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function Navbar({
  user: initialUser,
  onLogout,
  className = "",
}: NavbarProps) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(initialUser || null);

  useEffect(() => {
    if (initialUser) {
      setAdminUser(initialUser);
      return;
    }

    async function fetchCurrentAdmin() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const rawName =
            (user.user_metadata?.full_name as string) ||
            (user.user_metadata?.name as string) ||
            (user.email ? user.email.split('@')[0] : 'Admin');

          const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

          setAdminUser({
            name: formattedName,
            email: user.email || 'admin@daystar.com',
          });
        }
      } catch (err) {
        console.warn('Could not fetch admin user session:', err);
      }
    }

    fetchCurrentAdmin();
  }, [initialUser]);

  const activeUser = adminUser || { name: "Admin", email: "admin@daystar.com" };

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`w-64 h-screen sticky top-0 bg-[#FAF5F2] border-r border-[#EAE1DA] flex flex-col justify-between p-6 select-none shrink-0 overflow-y-auto z-30 print:hidden ${className}`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="pt-2 pb-4 text-center">
          <h1 className="font-serif text-2xl font-bold tracking-wider text-[#6E4B42] uppercase">
            DAYSTORE
          </h1>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#EAE1DA] w-full" />

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 pt-2">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#EFE6E0] text-[#6E4B42] font-semibold shadow-xs"
                    : "text-[#8A756C] hover:bg-[#F4ECE6] hover:text-[#6E4B42]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="flex flex-col gap-4">
        {/* Divider */}
        <div className="h-[1px] bg-[#EAE1DA] w-full" />

        {/* User Info & Logout Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-[#DCD4CF] flex items-center justify-center shrink-0 text-[#6E4B42] font-semibold text-sm">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            {/* User Text */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#6E4B42] truncate leading-tight">
                {activeUser.name}
              </span>
              <span className="text-xs text-[#A08C84] truncate leading-tight mt-0.5">
                {activeUser.email}
              </span>
            </div>
          </div>

          {/* Logout Icon */}
          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-[#8A756C] hover:text-[#6E4B42] hover:bg-[#EFE6E0] transition-colors shrink-0 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
