import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePendingApprovals } from "@/hooks/use-crm";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";
import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Pulse Dashboard",
    subtitle: "Live activity monitor for all entities",
  },
  "/vendors": {
    title: "Vendors",
    subtitle: "Manage vendor relationships and pipeline",
  },
  "/clients": { title: "Clients", subtitle: "Client accounts and job orders" },
  "/recruiters": {
    title: "Recruiters",
    subtitle: "Team productivity and performance",
  },
  "/candidates": {
    title: "Candidates",
    subtitle: "Candidate pipeline and placement tracking",
  },
  "/jobs": { title: "Jobs", subtitle: "Open positions and requirements" },
  "/follow-ups": {
    title: "Follow-Ups",
    subtitle: "AI-suggested actions pending your approval",
  },
  "/approvals": {
    title: "Approvals",
    subtitle: "Items requiring your review and sign-off",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Analytics and performance insights",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage integrations and app configuration",
  },
  "/sql-editor": {
    title: "SQL Editor",
    subtitle: "Run queries on your Supabase database",
  },
};

function getPageInfo(pathname: string) {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  const base = `/${pathname.split("/")[1]}`;
  return PAGE_TITLES[base] ?? { title: "HireNest", subtitle: "Command Center" };
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { data: pendingApprovals } = usePendingApprovals();
  const approvalCount = pendingApprovals?.length ?? 0;
  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className={cn(
            "flex items-center gap-3 h-14 px-4 border-b border-border bg-card flex-shrink-0",
          )}
          data-ocid="header"
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground transition-colors duration-150"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              data-ocid="header-menu-toggle"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          {/* Breadcrumb + title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate font-display">
              {title}
            </h1>
            <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
              {subtitle}
            </p>
          </div>

          {/* Right: theme toggle + search + notifications */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground transition-colors duration-150"
              disabled
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground relative transition-colors duration-150"
              aria-label={`${approvalCount} pending approvals`}
              data-ocid="header-notifications"
            >
              <Bell className="h-4 w-4" />
              {approvalCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[9px] flex items-center justify-center bg-primary text-primary-foreground border-0 rounded-full">
                  {approvalCount > 9 ? "9+" : approvalCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
