"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Pagination, Button, Modal } from "@/modules/shared";
import { Discount } from "@/types";

export interface DiscountRecord extends Partial<Discount> {
  id: string;
  code: string;
  title?: string;
  type: string;
  value: any;
  status?: "Active" | "Scheduled" | "Expired";
  usageCount?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  minRequirementType?: "none" | "amount" | "quantity";
  minRequirementValue?: string;
}

const initialDiscounts: DiscountRecord[] = [
  {
    id: "disc-1",
    code: "SUMMER2026",
    title: "Summer Sale 20% Off",
    type: "Percentage",
    value: "20% OFF",
    status: "Active",
    usageCount: 142,
    usageLimit: 500,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
  },
  {
    id: "disc-2",
    code: "WELCOME10",
    title: "New Customer Welcome Discount",
    type: "Fixed Amount",
    value: "$10.00 OFF",
    status: "Active",
    usageCount: 89,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "disc-3",
    code: "AUTUMN15",
    title: "Upcoming Fall Season Special",
    type: "Percentage",
    value: "15% OFF",
    status: "Scheduled",
    usageCount: 0,
    usageLimit: 200,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
  },
  {
    id: "disc-4",
    code: "FREESHIP50",
    title: "Free Express Shipping on $50+",
    type: "Free Shipping",
    value: "Free Shipping",
    status: "Active",
    usageCount: 310,
    startDate: "2026-03-15",
    endDate: "2026-12-31",
  },
  {
    id: "disc-5",
    code: "SPRING2025",
    title: "Spring Clearance Promotion",
    type: "Percentage",
    value: "25% OFF",
    status: "Expired",
    usageCount: 500,
    usageLimit: 500,
    startDate: "2025-03-01",
    endDate: "2025-05-31",
  },
  {
    id: "disc-6",
    code: "VIPMEMBER30",
    title: "Exclusive VIP Member Discount",
    type: "Percentage",
    value: "30% OFF",
    status: "Active",
    usageCount: 64,
    usageLimit: 100,
    startDate: "2026-02-01",
    endDate: "2026-12-31",
  },
];

export function DiscountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Scheduled" | "Expired">("All");
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(initialDiscounts);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Toast / Copy Feedback State
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    type: "Percentage" as DiscountRecord["type"],
    value: "20",
    status: "Active" as DiscountRecord["status"],
    startDate: "2026-06-01",
    endDate: "",
  });

  // Minimum requirements state
  const [minRequirementOption, setMinRequirementOption] = useState<"none" | "amount" | "quantity">("none");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [minQuantity, setMinQuantity] = useState("");

  const filteredDiscounts = discounts.filter((d) => {
    if (activeTab !== "All" && d.status !== activeTab) {
      return false;
    }
    if (
      searchQuery &&
      !d.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(d.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage) || 1;
  const paginatedDiscounts = filteredDiscounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = () => {
    setFormData({
      code: "SUMMER-SALE-20",
      title: "Summer Promotion",
      type: "Percentage",
      value: "20",
      status: "Active",
      startDate: "2026-06-01",
      endDate: "",
    });
    setMinRequirementOption("none");
    setMinPurchaseAmount("");
    setMinQuantity("");
    setEditingDiscount(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (discount: DiscountRecord) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      title: discount.title || "",
      type: (discount.type as any) || "Percentage",
      value: String(discount.value || "").replace(/[^0-9.]/g, "") || "20",
      status: discount.status || "Active",
      startDate: discount.startDate || "2026-06-01",
      endDate: discount.endDate || "",
    });
    setMinRequirementOption(discount.minRequirementType || "none");
    setMinPurchaseAmount(discount.minRequirementType === "amount" ? discount.minRequirementValue || "" : "");
    setMinQuantity(discount.minRequirementType === "quantity" ? discount.minRequirementValue || "" : "");
    setShowCreateModal(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;

    const formattedValue =
      formData.type === "Free Shipping"
        ? "Free Shipping"
        : formData.type === "Fixed Amount"
          ? `$${formData.value || "10"}.00 OFF`
          : `${formData.value || "20"}% OFF`;

    if (editingDiscount) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editingDiscount.id
            ? {
              ...d,
              code: formData.code.toUpperCase(),
              title: formData.title || `${formData.code} Discount`,
              type: formData.type,
              value: formattedValue,
              status: formData.status,
              startDate: formData.startDate || new Date().toISOString().split("T")[0],
              endDate: formData.endDate || "2026-12-31",
              minRequirementType: minRequirementOption,
              minRequirementValue:
                minRequirementOption === "amount"
                  ? minPurchaseAmount
                  : minRequirementOption === "quantity"
                    ? minQuantity
                    : undefined,
            }
            : d
        )
      );
    } else {
      const created: DiscountRecord = {
        id: `disc-${Date.now()}`,
        code: formData.code.toUpperCase(),
        title: formData.title || `${formData.code} Discount`,
        type: formData.type,
        value: formattedValue,
        status: formData.status,
        usageCount: 0,
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate || "2026-12-31",
        minRequirementType: minRequirementOption,
        minRequirementValue:
          minRequirementOption === "amount"
            ? minPurchaseAmount
            : minRequirementOption === "quantity"
              ? minQuantity
              : undefined,
      };
      setDiscounts([created, ...discounts]);
    }

    setShowCreateModal(false);
    setEditingDiscount(null);
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  };

  const getStatusBadge = (status: DiscountRecord["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#50E3C2]/20 text-[#044E35] border border-[#50E3C2]/40";
      case "Scheduled":
        return "bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE]";
      case "Expired":
        return "bg-stone-100 text-stone-600 border border-stone-200";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Feedback for Copying */}
      {copiedCode && (
        <div className="fixed top-6 right-6 z-50 bg-[#004D5A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-[#50E3C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied discount code "{copiedCode}"!
        </div>
      )}

      <PageHeader
        title="Discounts"
        subtitle="Welcome back. Here's what's happening with your store today."
      />

      {/* Filter Tabs & Create Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Tab Segmented Control */}
        <div className="inline-flex bg-white rounded-xl border border-[#E9E3DE] p-1 shadow-xs">
          {(["All", "Active", "Scheduled", "Expired"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab
                ? "bg-[#FAF5F2] text-[#3D2E28] font-semibold shadow-2xs"
                : "text-[#7A6860] hover:text-[#3D2E28]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          onClick={() => router.push("/discount/new")}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          Create Discount
        </Button>
      </div>

      {/* Search & Discounts Table Container */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] shadow-xs overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-[#E9E3DE] bg-[#FAF6F4]/50 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#8A756C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search discount code or campaign title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-sm bg-transparent outline-hidden text-[#3D2E28] placeholder-[#8A756C]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F4] border-b border-[#E9E3DE]">
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  DISCOUNT CODE
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  CAMPAIGN TITLE
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  VALUE
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  USAGE
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider">
                  START & END DATE
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#7A6860] uppercase tracking-wider text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E3]">
              {paginatedDiscounts.length > 0 ? (
                paginatedDiscounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-[#FAF6F4]/50 transition-colors">
                    {/* Code */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#FAF5F2] border border-[#E9E3DE] text-[#583F37]">
                          {discount.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(discount.code)}
                          title="Copy Discount Code"
                          className="text-[#8A756C] hover:text-[#583F37] p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 text-sm font-semibold text-[#3D2E28] whitespace-nowrap">
                      {discount.title}
                    </td>

                    {/* Value */}
                    <td className="px-6 py-4 text-sm font-medium text-[#583F37] whitespace-nowrap">
                      {discount.value}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                          discount.status
                        )}`}
                      >
                        {discount.status}
                      </span>
                    </td>

                    {/* Usage */}
                    <td className="px-6 py-4 text-sm text-[#6E5B53] whitespace-nowrap">
                      {discount.usageCount}{" "}
                      {discount.usageLimit ? `/ ${discount.usageLimit}` : "used"}
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 text-xs text-[#8A756C] whitespace-nowrap">
                      {discount.startDate} {discount.endDate ? `to ${discount.endDate}` : ""}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(discount)}
                          title="Edit Discount"
                          className="p-1.5 rounded-lg text-[#583F37] hover:bg-[#FAF5F2] border border-transparent hover:border-[#E9E3DE] transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => setDeletingId(discount.id)}
                          title="Delete Discount"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#8A756C]">
                    No discounts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDiscounts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemLabel="discounts"
        />
      </div>



      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDeleteDiscount(deletingId)}
        title="Delete Discount?"
        confirmText="Delete"
        confirmVariant="danger"
        maxWidth="sm"
      >
        <p className="text-sm text-[#6E5B53]">
          Are you sure you want to delete this discount campaign? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default DiscountPage;
