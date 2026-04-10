import {
  Briefcase,
  Building2,
  type LucideIcon,
  UserCheck,
  Users,
} from "lucide-react";
import type { EntityType } from "../../types/crm";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

export function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(ts));
}

export function formatRelativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(ts);
}

export function getEntityTypeLabel(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    vendor: "Vendor",
    client: "Client",
    recruiter: "Recruiter",
    candidate: "Candidate",
  };
  return labels[type] ?? type;
}

export function getEntityTypeIcon(type: EntityType): LucideIcon {
  const icons: Record<EntityType, LucideIcon> = {
    vendor: Building2,
    client: Briefcase,
    recruiter: Users,
    candidate: UserCheck,
  };
  return icons[type] ?? Users;
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = plural ?? `${singular}s`;
  return `${count} ${count === 1 ? singular : word}`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 1)}…`;
}
