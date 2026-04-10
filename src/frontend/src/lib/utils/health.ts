import type { HealthStatus } from "../../types/crm";

export function computeHealthStatus(score: number): HealthStatus {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

export function getHealthColor(status: HealthStatus): string {
  switch (status) {
    case "green":
      return "text-[#22c55e]";
    case "yellow":
      return "text-[#eab308]";
    case "red":
      return "text-[#ef4444]";
  }
}

export function getHealthBgColor(status: HealthStatus): string {
  switch (status) {
    case "green":
      return "bg-[#22c55e]";
    case "yellow":
      return "bg-[#eab308]";
    case "red":
      return "bg-[#ef4444]";
  }
}

export function getHealthDot(status: HealthStatus): string {
  switch (status) {
    case "green":
      return "health-green";
    case "yellow":
      return "health-yellow";
    case "red":
      return "health-red";
  }
}

export function getHealthLabel(score: number): string {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "At Risk";
  return "Critical";
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function getDaysInStage(
  enteredAt: number,
  now: number = Date.now(),
): number {
  return Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24));
}
