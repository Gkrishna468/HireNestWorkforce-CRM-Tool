import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useBenchRecords,
  usePendingApprovals,
  usePendingFollowUps,
} from "@/hooks/use-crm";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Archive,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  Database,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { data: pendingFollowUps } = usePendingFollowUps();
  const { data: pendingApprovals } = usePendingApprovals();

  const followUpCount = pendingFollowUps?.length ?? 0;
  const approvalCount = pendingApprovals?.length ?? 0;
  const { data: benchRecords } = useBenchRecords();
  const benchCount = benchRecords?.length ?? 0;

  const navItems: NavItem[] = [
    { label: "Pulse Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Vendors", href: "/vendors", icon: Building2 },
    { label: "Clients", href: "/clients", icon: Briefcase },
    { label: "Recruiters", href: "/recruiters", icon: Users },
    { label: "Candidates", href: "/candidates", icon: UserCheck },
    { label: "Jobs", href: "/jobs", icon: ClipboardList },
    { label: "Bench", href: "/bench", icon: Archive, badge: benchCount },
    {
      label: "Follow-Ups",
      href: "/follow-ups",
      icon: Bell,
      badge: followUpCount,
    },
    {
      label: "Approvals",
      href: "/approvals",
      icon: CheckSquare,
      badge: approvalCount,
    },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "SQL Editor", href: "/sql-editor", icon: Database },
  ];

  const sidebar = (
    <aside
      className={cn(
        "flex flex-col h-full w-[280px] bg-sidebar border-r border-sidebar-border flex-shrink-0",
        isMobile &&
          "fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-300",
        isMobile && !open && "-translate-x-full",
        isMobile && open && "translate-x-0",
      )}
      data-ocid="sidebar"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground font-display">
              HN
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white font-display leading-none">
              HireNest
            </p>
            <p className="text-[10px] text-sidebar-muted-foreground leading-none mt-0.5">
              Command Center
            </p>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <p className="px-2 py-1.5 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/dashboard" &&
              location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "sidebar-item flex items-center gap-2.5 w-full group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
              )}
              data-ocid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground",
                )}
              />
              <span className="flex-1 text-sm min-w-0 truncate">
                {item.label}
              </span>
              {item.badge != null && item.badge > 0 && (
                <Badge className="h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground border-0 rounded-full">
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}

        {/* Divider + Settings */}
        <div className="pt-2 pb-1">
          <div className="border-t border-sidebar-border" />
        </div>
        {(() => {
          const isActive = location.pathname === "/settings";
          return (
            <Link
              to="/settings"
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "sidebar-item flex items-center gap-2.5 w-full group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
              )}
              data-ocid="nav-settings"
            >
              <Settings
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground",
                )}
              />
              <span className="flex-1 text-sm min-w-0 truncate">Settings</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
              )}
            </Link>
          );
        })()}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              Manager
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 truncate">
              HireNest CRM
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            aria-hidden="true"
          />
        )}
        {sidebar}
      </>
    );
  }

  return sidebar;
}
