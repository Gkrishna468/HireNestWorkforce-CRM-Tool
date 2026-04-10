import { n as UserCheck, U as Users, m as Briefcase, l as Building2 } from "./index-CnVd8MW_.js";
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
function formatDate(ts) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(ts));
}
function formatDateTime(ts) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(ts));
}
function formatRelativeTime(ts) {
  const now = Date.now();
  const diff = now - ts;
  const seconds = Math.floor(diff / 1e3);
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
function getEntityTypeLabel(type) {
  const labels = {
    vendor: "Vendor",
    client: "Client",
    recruiter: "Recruiter",
    candidate: "Candidate"
  };
  return labels[type] ?? type;
}
function getEntityTypeIcon(type) {
  const icons = {
    vendor: Building2,
    client: Briefcase,
    recruiter: Users,
    candidate: UserCheck
  };
  return icons[type] ?? Users;
}
function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 1)}…`;
}
export {
  getEntityTypeLabel as a,
  formatCurrency as b,
  formatDateTime as c,
  formatRelativeTime as f,
  getEntityTypeIcon as g,
  truncate as t
};
