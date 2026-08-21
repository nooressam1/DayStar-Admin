"use client";

import React, { useMemo } from "react";
import {
  PageHeader,
  DashboardStats,
  SalesChart,
  RecentOrdersTable,
  formatMoney,
  getInitials,
  OrderStatus,
  RecentOrderItem,
  SalesChartItem,
} from "@/modules/shared";
import { useGetAdminOrders } from "@/app/api/hooks/useOrders";
import { useGetProducts } from "@/app/api/hooks/useProducts";
import { useGetCustomers } from "@/app/api/hooks/useCustomers";

export function DashboardPage() {
  const { data: ordersResponse, isLoading: isLoadingOrders } = useGetAdminOrders({ limit: 100 });
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetProducts({ limit: 100 });
  const { data: customersResponse, isLoading: isLoadingCustomers } = useGetCustomers({ limit: 100 });

  const isStatsLoading = isLoadingOrders && isLoadingProducts && isLoadingCustomers;

  // 1. Total Sales Stat
  const salesStat = useMemo(() => {
    if (!ordersResponse?.items || ordersResponse.items.length === 0) return undefined;
    const totalSum = ordersResponse.items.reduce((acc, order) => acc + (order.total || 0), 0);
    return {
      title: "TOTAL SALES",
      value: formatMoney(totalSum),
      change: "+12.5%",
      showSparkline: true,
    };
  }, [ordersResponse]);

  // 2. Active Orders Stat
  const ordersStat = useMemo(() => {
    if (!ordersResponse?.items || ordersResponse.items.length === 0) return undefined;
    const totalCount = ordersResponse.total || ordersResponse.items.length;
    const activeCount = ordersResponse.items.filter((o) => {
      const s = (o.status || "").toUpperCase();
      return s === "PENDING" || s === "PROCESSING" || s === "SHIPPED";
    }).length;

    const percentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

    return {
      title: "ACTIVE ORDERS",
      value: activeCount.toLocaleString(),
      percentage,
    };
  }, [ordersResponse]);

  // 3. Low Stock Stat
  const lowStockStat = useMemo(() => {
    if (!productsResponse?.items) return undefined;
    const inactiveOrLowCount = productsResponse.items.filter((p) => !p.is_active).length;
    return {
      title: "LOW STOCK",
      value: `${inactiveOrLowCount} Items`,
      linkText: "Review Inventory",
      linkHref: "/inventory",
    };
  }, [productsResponse]);

  // 4. New Customers Stat
  const newCustomersStat = useMemo(() => {
    if (!customersResponse) return undefined;
    const count = customersResponse.total ?? customersResponse.items?.length ?? 0;
    return {
      title: "NEW CUSTOMERS",
      value: `+${count}`,
    };
  }, [customersResponse]);

  // 5. Recent Orders (First 5)
  const recentOrders: RecentOrderItem[] = useMemo(() => {
    if (!ordersResponse?.items) return [];
    return ordersResponse.items.slice(0, 5).map((order) => ({
      id: order.id,
      displayId: order.order_number ? `#${order.order_number}` : `#${order.id.slice(0, 8)}`,
      customerName: order.full_name || "Guest Customer",
      customerInitials: getInitials(order.full_name),
      status: (order.status?.toUpperCase() as OrderStatus) || OrderStatus.PENDING,
      amount: formatMoney(order.total),
    }));
  }, [ordersResponse]);

  // 6. Sales Performance Chart Data
  const salesChartData: SalesChartItem[] | undefined = useMemo(() => {
    if (!ordersResponse?.items || ordersResponse.items.length === 0) return undefined;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const daysList: { dateKey: string; dayLabel: string }[] = [];
    const daysMap: Record<string, { day: string; revenue: number; orders: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dayLabel = dayNames[d.getDay()];
      daysList.push({ dateKey, dayLabel });
      daysMap[dateKey] = { day: dayLabel, revenue: 0, orders: 0 };
    }

    ordersResponse.items.forEach((order) => {
      if (!order.created_at) return;
      const dateKey = order.created_at.split("T")[0];
      if (daysMap[dateKey]) {
        daysMap[dateKey].revenue += order.total || 0;
        daysMap[dateKey].orders += 1;
      }
    });

    return daysList.map(({ dateKey, dayLabel }) => {
      const item = daysMap[dateKey];
      return {
        day: dayLabel,
        value: item.revenue,
        secondaryValue: item.orders,
        label: formatMoney(item.revenue),
        subLabel: `${item.orders} ${item.orders === 1 ? "Order" : "Orders"}`,
      };
    });
  }, [ordersResponse]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's what's happening with your store today."
      />

      {/* Metrics Overview Component */}
      <DashboardStats
        salesData={salesStat}
        ordersData={ordersStat}
        lowStockData={lowStockStat}
        newCustomersData={newCustomersStat}
        isLoading={isStatsLoading}
      />

      {/* Sales Performance Chart Component */}
      <SalesChart data={salesChartData} isLoading={isLoadingOrders} />

      {/* Recent Orders Table Component */}
      <RecentOrdersTable orders={recentOrders} isLoading={isLoadingOrders} />
    </div>
  );
}

export default DashboardPage;
