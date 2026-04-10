import { c as createLucideIcon, r as reactExports, u as useMorningBriefing, a as usePendingApprovals, b as usePendingFollowUps, d as useNavigate, j as jsxRuntimeExports, X, B as Bell, e as Badge, f as cn, S as SquareCheckBig, g as Button, C as ChevronRight, h as usePulseDashboard, i as useSeedSampleData, k as useRunFollowUpEngine, P as PageLoadingSpinner, l as Building2, m as Briefcase, U as Users, n as UserCheck, D as Database, L as Link } from "./index-MOBRw3I1.js";
import { E as EmptyState } from "./EmptyState-CdwpJjbU.js";
import { c as computeHealthStatus, H as HealthBadge } from "./HealthBadge-DqTn_R8G.js";
import { S as Skeleton } from "./skeleton-DLRVwWw_.js";
import { T as TriangleAlert } from "./triangle-alert-CVQ5eevB.js";
import { S as StatCard } from "./StatCard-nZk8Xubt.js";
import { I as Input } from "./input-DbVJveBF.js";
import { f as formatRelativeTime, g as getEntityTypeIcon, a as getEntityTypeLabel } from "./format-995zKMG2.js";
import { C as CircleAlert } from "./circle-alert-Bvw-Pq2b.js";
import { R as RefreshCw } from "./refresh-cw-CdCWzL9Q.js";
import { C as ChevronDown } from "./chevron-down-C2nMLnPR.js";
import { C as Clock } from "./clock-BFAJOv3f.js";
import "./trending-up-Fd9OcFRM.js";
import "./trending-down-C_req-kV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
];
const CircleUser = createLucideIcon("circle-user", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const DISMISS_KEY = "hirenest-briefing-dismissed";
function getTodayKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function useBriefingDismissed() {
  const dismissed = reactExports.useMemo(() => {
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      return stored === getTodayKey();
    } catch {
      return false;
    }
  }, []);
  const dismiss = reactExports.useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, getTodayKey());
    } catch {
    }
  }, []);
  return { dismissed, dismiss };
}
function MorningBriefingPanel({ onDismiss }) {
  var _a, _b, _c, _d;
  const { data: briefing, isLoading } = useMorningBriefing();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: pendingFollowUps } = usePendingFollowUps();
  const navigate = useNavigate();
  const approvalCount = (pendingApprovals == null ? void 0 : pendingApprovals.length) ?? 0;
  const followUpCount = (pendingFollowUps == null ? void 0 : pendingFollowUps.length) ?? 0;
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-[oklch(0.7_0.18_200)] bg-card rounded-sm p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-6 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-5/6" })
    ] });
  }
  const priorities = (briefing == null ? void 0 : briefing.priorities) ?? [];
  const recruiterActivity = (briefing == null ? void 0 : briefing.recruiterActivity) ?? [];
  const aiSuggestions = (briefing == null ? void 0 : briefing.aiSuggestions) ?? [];
  const vendorFollowUps = ((_a = priorities.find((p) => p.category === "vendor_followups")) == null ? void 0 : _a.count) ?? 0;
  const clientInterviews = ((_b = priorities.find((p) => p.category === "client_interviews")) == null ? void 0 : _b.count) ?? 0;
  const offerApprovals = ((_c = priorities.find((p) => p.category === "offer_approvals")) == null ? void 0 : _c.count) ?? 0;
  const staleCandidates = ((_d = priorities.find((p) => p.category === "stale_candidates")) == null ? void 0 : _d.count) ?? 0;
  const hasPriorities = vendorFollowUps > 0 || clientInterviews > 0 || offerApprovals > 0 || staleCandidates > 0 || priorities.length > 0;
  const flaggedRecruiters = recruiterActivity.filter(
    (r) => (r.count ?? 100) < 70
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-l-4 border-[oklch(0.7_0.18_200)] bg-card rounded-sm overflow-hidden",
      "data-ocid": "morning-briefing-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-[oklch(0.18_0.02_207)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[oklch(0.7_0.18_200)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-[oklch(0.7_0.18_200)] font-display tracking-wide uppercase", children: "Daily Briefing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "— ",
              today
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDismiss,
              "aria-label": "Dismiss briefing",
              className: "p-0.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "briefing-dismiss-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BriefingSection,
            {
              icon: Bell,
              title: "Priorities",
              iconColor: "text-[oklch(0.85_0.24_80)]",
              empty: !hasPriorities,
              emptyText: "All clear — no urgent priorities",
              children: hasPriorities && /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
                vendorFollowUps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "yellow", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: vendorFollowUps }),
                  " vendor",
                  vendorFollowUps !== 1 ? "s" : "",
                  " need follow-up",
                  approvalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    " ",
                    "(",
                    Math.min(approvalCount, vendorFollowUps),
                    " pending approval)"
                  ] })
                ] }),
                clientInterviews > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "cyan", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: clientInterviews }),
                  " client interview",
                  clientInterviews !== 1 ? "s" : "",
                  " today"
                ] }),
                offerApprovals > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "red", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: offerApprovals }),
                  " offer approval",
                  offerApprovals !== 1 ? "s" : "",
                  " required"
                ] }),
                staleCandidates > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "yellow", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: staleCandidates }),
                  " candidate",
                  staleCandidates !== 1 ? "s" : "",
                  " stale >3 days"
                ] }),
                priorities.filter(
                  (p) => ![
                    "vendor_followups",
                    "client_interviews",
                    "offer_approvals",
                    "stale_candidates"
                  ].includes(p.category)
                ).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "cyan", children: [
                  p.message,
                  p.count != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "ml-1 text-[10px] px-1 py-0 h-4",
                      children: p.count
                    }
                  )
                ] }, p.category))
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BriefingSection,
            {
              icon: ChartNoAxesColumn,
              title: "Recruiter Activity (Yesterday)",
              iconColor: "text-[oklch(0.68_0.22_142)]",
              empty: recruiterActivity.length === 0,
              emptyText: "No recruiter activity recorded",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: recruiterActivity.map((r) => {
                  const score = r.count ?? 0;
                  const flagged = score > 0 && score < 70;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    BriefingItem,
                    {
                      bullet: flagged ? "red" : "green",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.message }),
                        score > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: cn(
                              "ml-1 text-xs font-semibold",
                              flagged ? "text-[oklch(0.65_0.19_22)]" : "text-[oklch(0.68_0.22_142)]"
                            ),
                            children: [
                              score,
                              "% productivity",
                              flagged && " ⚑"
                            ]
                          }
                        )
                      ]
                    },
                    r.category
                  );
                }) }),
                flaggedRecruiters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[10px] text-[oklch(0.85_0.24_80)]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                  flaggedRecruiters.length,
                  " recruiter",
                  flaggedRecruiters.length !== 1 ? "s" : "",
                  " flagged for low productivity"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BriefingSection,
            {
              icon: SquareCheckBig,
              title: "Follow-Up Queue",
              iconColor: "text-primary",
              empty: followUpCount === 0 && approvalCount === 0,
              emptyText: "No pending follow-ups",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
                followUpCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "cyan", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: followUpCount }),
                  " follow-up suggestion",
                  followUpCount !== 1 ? "s" : "",
                  " awaiting approval"
                ] }),
                approvalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(BriefingItem, { bullet: "yellow", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: approvalCount }),
                  " item",
                  approvalCount !== 1 ? "s" : "",
                  " in approval queue"
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BriefingSection,
            {
              icon: TriangleAlert,
              title: "AI Suggestions",
              iconColor: "text-[oklch(0.85_0.24_80)]",
              empty: aiSuggestions.length === 0,
              emptyText: "No alerts at this time",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: aiSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(BriefingItem, { bullet: "yellow", children: s.message }, s.category)) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 border-t border-border bg-[oklch(0.14_0.01_207)] flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs gap-1",
              onClick: () => navigate({ to: "/dashboard" }),
              "data-ocid": "briefing-pulse-btn",
              children: [
                "View Pulse ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs gap-1",
              onClick: () => navigate({ to: "/approvals" }),
              "data-ocid": "briefing-approvals-btn",
              children: [
                "Approve Queue",
                approvalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 px-1 text-[10px] ml-0.5 bg-primary text-primary-foreground", children: approvalCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs text-muted-foreground",
              onClick: onDismiss,
              "data-ocid": "briefing-dismiss-footer-btn",
              children: "Dismiss for today"
            }
          )
        ] })
      ]
    }
  );
}
function BriefingSection({
  icon: Icon,
  title,
  iconColor,
  children,
  empty,
  emptyText
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-3 w-3 flex-shrink-0", iconColor) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: title })
    ] }),
    empty ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: emptyText }) : children
  ] });
}
function BriefingItem({ bullet = "cyan", children }) {
  const dotClass = {
    green: "bg-[oklch(0.68_0.22_142)]",
    yellow: "bg-[oklch(0.85_0.24_80)]",
    red: "bg-[oklch(0.65_0.19_22)]",
    cyan: "bg-[oklch(0.7_0.18_200)]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5 text-xs text-foreground leading-snug", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
          dotClass[bullet]
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children })
  ] });
}
function getDetailPath(entityId, entityType) {
  const routeMap = {
    vendor: `/vendors/${entityId}`,
    client: `/clients/${entityId}`,
    recruiter: `/recruiters/${entityId}`,
    candidate: `/candidates/${entityId}`
  };
  return routeMap[entityType];
}
function healthDotClass(score) {
  const status = computeHealthStatus(score);
  if (status === "green") return "bg-[#22c55e]";
  if (status === "yellow") return "bg-[#eab308]";
  return "bg-[#ef4444]";
}
function healthTextClass(score) {
  const status = computeHealthStatus(score);
  if (status === "green") return "text-[#22c55e]";
  if (status === "yellow") return "text-[#eab308]";
  return "text-[#ef4444]";
}
const FILTER_OPTIONS = [
  { value: "all", label: "All", Icon: CircleUser },
  { value: "vendor", label: "Vendors", Icon: Building2 },
  { value: "client", label: "Clients", Icon: Briefcase },
  { value: "recruiter", label: "Recruiters", Icon: Users },
  { value: "candidate", label: "Candidates", Icon: UserCheck }
];
function FilterToggle({ active, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: FILTER_OPTIONS.map(({ value, label, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onChange(value),
      "data-ocid": `filter-${value}`,
      className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${active === value ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
        label
      ]
    },
    value
  )) });
}
const SORT_OPTIONS = [
  { value: "health-desc", label: "Health (High → Low)" },
  { value: "health-asc", label: "Health (Low → High)" },
  { value: "last-activity", label: "Last Activity" },
  { value: "name", label: "Name (A → Z)" }
];
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = reactExports.useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((p) => !p),
        onKeyDown: (e) => e.key === "Escape" && setOpen(false),
        "data-ocid": "sort-dropdown",
        className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-150",
        children: [
          current == null ? void 0 : current.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded shadow-lg min-w-[180px] py-1", children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          onChange(opt.value);
          setOpen(false);
        },
        className: `w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${opt.value === value ? "text-primary font-medium" : "text-foreground"}`,
        children: opt.label
      },
      opt.value
    )) })
  ] });
}
function PulseTableRow({
  entry,
  pendingCount
}) {
  const Icon = getEntityTypeIcon(entry.entityType);
  const detailPath = getDetailPath(entry.entityId, entry.entityType);
  const typeColors = {
    vendor: "bg-[oklch(0.22_0.04_207)] text-[oklch(0.7_0.14_207)]",
    client: "bg-[oklch(0.22_0.04_142)] text-[oklch(0.7_0.14_142)]",
    recruiter: "bg-[oklch(0.22_0.04_80)] text-[oklch(0.7_0.14_80)]",
    candidate: "bg-[oklch(0.22_0.04_300)] text-[oklch(0.7_0.14_300)]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-muted/30 cursor-pointer transition-colors duration-100 group",
      "data-ocid": "pulse-row",
      onClick: () => {
        window.location.href = detailPath;
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") window.location.href = detailPath;
      },
      tabIndex: 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors", children: entry.name }),
            entry.company && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: entry.company })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[entry.entityType]}`,
            children: getEntityTypeLabel(entry.entityType)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: entry.currentStage }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-2 h-2 rounded-full flex-shrink-0 ${healthDotClass(entry.healthScore)}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs font-semibold font-mono ${healthTextClass(entry.healthScore)}`,
              children: entry.healthScore
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 flex-shrink-0" }),
          entry.lastActivityAt ? formatRelativeTime(entry.lastActivityAt) : "No activity"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden sm:table-cell", children: entry.actionsNeeded.length > 0 || pendingCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/approvals",
            onClick: (e) => e.stopPropagation(),
            className: "inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors",
            "data-ocid": "action-needed-link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
              entry.actionsNeeded.length > 0 ? entry.actionsNeeded[0] : `${pendingCount} pending`
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: detailPath,
            onClick: (e) => e.stopPropagation(),
            className: "text-[10px] text-primary hover:text-primary/80 font-medium transition-colors",
            "data-ocid": "view-entity-btn",
            children: "View →"
          }
        ) })
      ]
    }
  );
}
function PulseMobileCard({ entry }) {
  const Icon = getEntityTypeIcon(entry.entityType);
  const detailPath = getDetailPath(entry.entityId, entry.entityType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: detailPath,
      className: "block bg-card border border-border rounded p-3 hover:border-primary/40 transition-colors",
      "data-ocid": "pulse-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: entry.name }),
              entry.company && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: entry.company })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: entry.healthScore, showScore: true, size: "sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: getEntityTypeLabel(entry.entityType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: entry.currentStage }),
          entry.lastActivityAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
            formatRelativeTime(entry.lastActivityAt)
          ] })
        ] }),
        entry.actionsNeeded.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-amber-400 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
          entry.actionsNeeded[0]
        ] }) })
      ]
    }
  );
}
function SkeletonRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Array.from({ length: 6 }, (_, i) => `skel-row-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-6 h-6 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-20" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-10" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-16" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-20" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-10" }) })
  ] }, key)) });
}
function DashboardPage() {
  const {
    data: dashboard,
    isLoading,
    dataUpdatedAt,
    refetch
  } = usePulseDashboard();
  const { data: approvals } = usePendingApprovals();
  const seedMutation = useSeedSampleData();
  const followUpMutation = useRunFollowUpEngine();
  const { dismissed, dismiss } = useBriefingDismissed();
  const [briefingVisible, setBriefingVisible] = reactExports.useState(!dismissed);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("health-desc");
  const [followUpResult, setFollowUpResult] = reactExports.useState(null);
  const pendingApprovalsCount = (approvals == null ? void 0 : approvals.length) ?? 0;
  const colorCounts = reactExports.useMemo(() => {
    const entries = (dashboard == null ? void 0 : dashboard.entries) ?? [];
    return {
      green: entries.filter(
        (e) => computeHealthStatus(e.healthScore) === "green"
      ).length,
      yellow: entries.filter(
        (e) => computeHealthStatus(e.healthScore) === "yellow"
      ).length,
      red: entries.filter((e) => computeHealthStatus(e.healthScore) === "red").length
    };
  }, [dashboard]);
  const filteredEntries = reactExports.useMemo(() => {
    let entries = (dashboard == null ? void 0 : dashboard.entries) ?? [];
    if (filter !== "all") {
      entries = entries.filter((e) => e.entityType === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        (e) => e.name.toLowerCase().includes(q) || (e.company ?? "").toLowerCase().includes(q) || e.currentStage.toLowerCase().includes(q)
      );
    }
    return [...entries].sort((a, b) => {
      switch (sortKey) {
        case "health-desc":
          return b.healthScore - a.healthScore;
        case "health-asc":
          return a.healthScore - b.healthScore;
        case "last-activity":
          return (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [dashboard, filter, search, sortKey]);
  const hasData = ((dashboard == null ? void 0 : dashboard.entries.length) ?? 0) > 0;
  const lastUpdatedLabel = dataUpdatedAt ? formatRelativeTime(dataUpdatedAt) : "—";
  const handleRunFollowUpEngine = async () => {
    const before = ((dashboard == null ? void 0 : dashboard.entries) ?? []).reduce(
      (acc, e) => acc + e.actionsNeeded.length,
      0
    );
    await followUpMutation.mutateAsync();
    await refetch();
    const after = ((dashboard == null ? void 0 : dashboard.entries) ?? []).reduce(
      (acc, e) => acc + e.actionsNeeded.length,
      0
    );
    setFollowUpResult(Math.max(0, after - before));
    setTimeout(() => setFollowUpResult(null), 5e3);
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0 pb-6", "data-ocid": "dashboard-page", children: [
    briefingVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MorningBriefingPanel,
      {
        onDismiss: () => {
          dismiss();
          setBriefingVisible(false);
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Vendors",
          value: (dashboard == null ? void 0 : dashboard.totalVendors) ?? 0,
          icon: Building2,
          onClick: () => {
            window.location.href = "/vendors";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Clients",
          value: (dashboard == null ? void 0 : dashboard.totalClients) ?? 0,
          icon: Briefcase,
          onClick: () => {
            window.location.href = "/clients";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Recruiters",
          value: (dashboard == null ? void 0 : dashboard.totalRecruiters) ?? 0,
          icon: Users,
          onClick: () => {
            window.location.href = "/recruiters";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Candidates",
          value: (dashboard == null ? void 0 : dashboard.totalCandidates) ?? 0,
          icon: UserCheck,
          onClick: () => {
            window.location.href = "/candidates";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Approvals",
          value: pendingApprovalsCount,
          icon: CircleAlert,
          iconColor: pendingApprovalsCount > 0 ? "text-amber-400" : void 0,
          onClick: () => {
            window.location.href = "/approvals";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-sm p-3 flex flex-col gap-2",
          "data-ocid": "health-dist-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Health" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-[#22c55e]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#22c55e]" }),
                colorCounts.green
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-[#eab308]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#eab308]" }),
                colorCounts.yellow
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-[#ef4444]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#ef4444]" }),
                colorCounts.red
              ] })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border-b border-border px-4 py-2 flex items-center justify-between gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#22c55e]" }),
          "Active (70-100)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#eab308]" }),
          "Warning (40-79)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#ef4444]" }),
          "Critical (<40)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground hidden sm:inline", children: [
          "Updated ",
          lastUpdatedLabel
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground",
            onClick: () => refetch(),
            "data-ocid": "refresh-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground",
            onClick: handleRunFollowUpEngine,
            disabled: followUpMutation.isPending,
            "data-ocid": "run-followup-engine-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
              followUpMutation.isPending ? "Running…" : "Run Follow-Up Engine"
            ]
          }
        )
      ] })
    ] }),
    followUpResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded text-xs text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 flex-shrink-0" }),
      followUpResult > 0 ? `Generated ${followUpResult} new follow-up suggestion${followUpResult !== 1 ? "s" : ""}` : "Follow-up engine ran — no new suggestions at this time"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-3 pb-2 flex flex-wrap gap-2 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterToggle, { active: filter, onChange: setFilter }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto flex-1 min-w-[160px] max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search entities…",
            className: "h-7 text-xs bg-card border-border",
            "data-ocid": "search-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortDropdown, { value: sortKey, onChange: setSortKey })
      ] })
    ] }),
    !hasData ? (
      /* Empty state */
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: Database,
          title: "No entities yet",
          message: "Seed the system with sample data to see vendors, clients, recruiters, and candidates in the Pulse dashboard.",
          action: {
            label: seedMutation.isPending ? "Seeding…" : "Seed Sample Data",
            onClick: () => seedMutation.mutate()
          }
        }
      ) })
    ) : filteredEntries.length === 0 ? (
      /* No results from filter/search */
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          title: "No matches found",
          message: "Try adjusting your filters or search term."
        }
      ) })
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 hidden md:block", "data-ocid": "pulse-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Entity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Stage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Health" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Last Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Action Needed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}) : filteredEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PulseTableRow,
            {
              entry,
              pendingCount: entry.actionsNeeded.length > 0 ? entry.actionsNeeded.length : 0
            },
            entry.entityId
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-muted/20 px-3 py-1.5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            filteredEntries.length,
            " of ",
            (dashboard == null ? void 0 : dashboard.entries.length) ?? 0,
            " ",
            "entities"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#22c55e]" }),
              colorCounts.green,
              " active"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#eab308]" }),
              colorCounts.yellow,
              " warning"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#ef4444]" }),
              colorCounts.red,
              " critical"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-4 flex flex-col gap-2 md:hidden",
          "data-ocid": "pulse-cards",
          children: isLoading ? Array.from({ length: 4 }, (_, i) => `skel-card-${i}`).map(
            (key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded" }, key)
          ) : filteredEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(PulseMobileCard, { entry }, entry.entityId))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 mt-4 flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border pt-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Legend:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#22c55e]" }),
        " Green = Active (health 70-100, last activity <24h)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#eab308]" }),
        " Yellow = Warning (health 40-69, 1-2 days)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[#ef4444]" }),
        " Red = Critical (health <40, stale 3+ days)"
      ] })
    ] })
  ] });
}
export {
  DashboardPage as default
};
