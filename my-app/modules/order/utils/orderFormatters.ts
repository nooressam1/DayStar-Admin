export { formatDate } from "@/utils/format";

export function getInitials(name?: string, fallbackInitials?: string): string {
  if (fallbackInitials) return fallbackInitials;
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
