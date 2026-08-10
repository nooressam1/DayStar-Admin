import { FilterDefault } from "@/modules/shared";

export const CUSTOMER_STATUS_OPTIONS = [
  { label: "All Accounts", value: "All Accounts" },
  { label: "Active", value: "Active" },
  { label: "Disabled", value: "Disabled" },
];

export interface CustomerFilterConfig extends FilterDefault {
  type: "select" | "search";
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue: string;
}

export const CUSTOMER_FILTERS: CustomerFilterConfig[] = [
  {
    key: "status",
    type: "select",
    label: "Status",
    options: CUSTOMER_STATUS_OPTIONS,
    defaultValue: "All Accounts",
  },
  {
    key: "search",
    type: "search",
    placeholder: "Search by ID, name, or phone...",
    defaultValue: "",
  },
];
