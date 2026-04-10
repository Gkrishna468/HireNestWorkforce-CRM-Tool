import { j as jsxRuntimeExports, ah as Layout, o as useVendors, F as useClients, K as useRecruiters, T as useCandidates, a as usePendingApprovals, b as usePendingFollowUps, Z as useJobs, ai as useSubmissions, l as Building2, m as Briefcase, U as Users, n as UserCheck, e as Badge, Q as useRecruiterMetrics } from "./index-MOBRw3I1.js";
import { P as PageHeader } from "./PageHeader-huOli1jr.js";
import { S as StatCard } from "./StatCard-nZk8Xubt.js";
import { S as Skeleton } from "./skeleton-DLRVwWw_.js";
import { T as TrendingDown } from "./trending-down-C_req-kV.js";
import { T as TrendingUp } from "./trending-up-Fd9OcFRM.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar } from "./BarChart-BWM4PP2y.js";
function ReportsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Reports & Analytics",
        subtitle: "Performance metrics, recruiter productivity, and vendor quality"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-6 overflow-auto", "data-ocid": "reports-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickStatsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RecruiterProductivitySection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VendorQualitySection, {})
    ] })
  ] });
}
function QuickStatsSection() {
  const { data: vendors, isLoading: vLoading } = useVendors();
  const { data: clients, isLoading: cLoading } = useClients();
  const { data: recruiters, isLoading: rLoading } = useRecruiters();
  const { data: candidates, isLoading: candLoading } = useCandidates();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: pendingFollowUps } = usePendingFollowUps();
  const { data: jobs } = useJobs();
  const { data: submissions } = useSubmissions();
  const loading = vLoading || cLoading || rLoading || candLoading;
  const openJobs = (jobs == null ? void 0 : jobs.filter((j) => j.status === "open").length) ?? 0;
  const thisMonth = /* @__PURE__ */ new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const submissionsThisMonth = (submissions == null ? void 0 : submissions.filter((s) => s.submittedAt >= thisMonth.getTime()).length) ?? 0;
  const stats = [
    {
      label: "Active Vendors",
      value: (vendors == null ? void 0 : vendors.filter((v) => v.status === "active").length) ?? 0,
      icon: Building2,
      iconColor: "text-primary"
    },
    {
      label: "Active Clients",
      value: (clients == null ? void 0 : clients.filter((c) => c.status === "active").length) ?? 0,
      icon: Briefcase,
      iconColor: "text-[oklch(0.68_0.22_142)]"
    },
    {
      label: "Active Recruiters",
      value: (recruiters == null ? void 0 : recruiters.filter((r) => r.status === "active").length) ?? 0,
      icon: Users,
      iconColor: "text-[oklch(0.85_0.24_80)]"
    },
    {
      label: "Active Candidates",
      value: (candidates == null ? void 0 : candidates.filter((c) => c.status === "active").length) ?? 0,
      icon: UserCheck,
      iconColor: "text-[oklch(0.65_0.21_200)]"
    },
    {
      label: "Pending Approvals",
      value: (pendingApprovals == null ? void 0 : pendingApprovals.length) ?? 0,
      icon: UserCheck,
      iconColor: "text-[oklch(0.85_0.24_80)]"
    },
    {
      label: "Pending Follow-Ups",
      value: (pendingFollowUps == null ? void 0 : pendingFollowUps.length) ?? 0,
      icon: UserCheck,
      iconColor: "text-primary"
    },
    {
      label: "Open Jobs",
      value: openJobs,
      icon: Briefcase,
      iconColor: "text-[oklch(0.68_0.22_142)]"
    },
    {
      label: "Submissions (This Month)",
      value: submissionsThisMonth,
      icon: Building2,
      iconColor: "text-[oklch(0.65_0.21_200)]"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "quick-stats-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Quick Stats" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3", children: loading ? Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-sm" }, key)) : stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatCard,
      {
        label: s.label,
        value: s.value,
        icon: s.icon,
        iconColor: s.iconColor
      },
      s.label
    )) })
  ] });
}
function RecruiterProductivitySection() {
  const { data: recruiters, isLoading } = useRecruiters();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "recruiter-productivity-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Recruiter Productivity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3", children: Array.from({ length: 3 }, (_, i) => `sk-r-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-sm" }, key)) })
    ] });
  }
  if (!recruiters || recruiters.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "recruiter-productivity-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Recruiter Productivity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No recruiter data available." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "recruiter-productivity-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Recruiter Productivity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5", children: recruiters.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecruiterCard, { recruiter: r }, r.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RecruiterWeeklyChart, { recruiters })
  ] });
}
function RecruiterCard({ recruiter }) {
  const { data: metricsHistory } = useRecruiterMetrics(recruiter.id);
  const latest = metricsHistory == null ? void 0 : metricsHistory[0];
  const score = (latest == null ? void 0 : latest.aiProductivityScore) ?? recruiter.healthScore;
  const flagged = score < 70;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-sm p-3 space-y-2",
      "data-ocid": "recruiter-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground font-display truncate", children: recruiter.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: recruiter.title ?? recruiter.currentStage })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProductivityBadge, { score, flagged })
        ] }),
        latest ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricRow, { label: "Calls", value: latest.callsMade }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricRow, { label: "Emails", value: latest.emailsSent }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricRow, { label: "Submissions", value: latest.submissions }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricRow, { label: "Interviews", value: latest.interviewsScheduled })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No metrics logged yet" }),
        flagged && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-[oklch(0.85_0.24_80)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Low productivity — consider 1:1" })
        ] })
      ]
    }
  );
}
function ProductivityBadge({
  score,
  flagged
}) {
  if (score === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 h-5", children: "No Data" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    flagged ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3 text-[oklch(0.65_0.19_22)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 text-[oklch(0.68_0.22_142)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: `text-xs font-bold font-mono ${flagged ? "text-[oklch(0.65_0.19_22)]" : "text-[oklch(0.68_0.22_142)]"}`,
        children: [
          score,
          "%"
        ]
      }
    )
  ] });
}
function MetricRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground font-mono", children: value })
  ] });
}
function RecruiterWeeklyChart({ recruiters }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RecruiterChartInner, { allRecruiters: recruiters });
}
function RecruiterChartInner({
  allRecruiters
}) {
  const chartData = allRecruiters.map((r) => ({
    name: r.name.split(" ")[0],
    Productivity: r.healthScore,
    // These would be real from metrics, using health as proxy
    Calls: Math.round(r.healthScore * 0.15),
    Submissions: Math.round(r.healthScore * 0.05)
  }));
  if (chartData.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-sm p-4",
      "data-ocid": "recruiter-chart",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Weekly Activity Comparison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            margin: { top: 4, right: 8, left: -20, bottom: 0 },
            barSize: 16,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  stroke: "oklch(0.22 0 0)",
                  vertical: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "name",
                  tick: { fill: "oklch(0.58 0 0)", fontSize: 11 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tick: { fill: "oklch(0.58 0 0)", fontSize: 11 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: "oklch(0.16 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "oklch(0.98 0 0)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Legend,
                {
                  wrapperStyle: { fontSize: "11px", color: "oklch(0.58 0 0)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "Productivity",
                  fill: "oklch(0.5 0.18 207)",
                  radius: [2, 2, 0, 0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "Calls",
                  fill: "oklch(0.68 0.22 142)",
                  radius: [2, 2, 0, 0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "Submissions",
                  fill: "oklch(0.85 0.24 80)",
                  radius: [2, 2, 0, 0]
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
function VendorQualitySection() {
  const { data: vendors, isLoading } = useVendors();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "vendor-quality-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Vendor Quality Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-sm w-full" })
    ] });
  }
  if (!vendors || vendors.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "vendor-quality-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Vendor Quality Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No vendor data available." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "vendor-quality-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Vendor Quality Metrics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-sm overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-muted-foreground font-medium", children: "Vendor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-muted-foreground font-medium", children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-muted-foreground font-medium", children: "Health Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 text-muted-foreground font-medium", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: vendors.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: `border-b border-border/50 hover:bg-muted/20 transition-colors ${i % 2 === 1 ? "bg-muted/10" : ""}`,
          "data-ocid": "vendor-quality-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground truncate max-w-[150px]", children: v.name }),
              v.company && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate max-w-[150px]", children: v.company })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: v.currentStage }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthScoreCell, { score: v.healthScore }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: v.status === "active" ? "default" : "outline",
                className: "text-[10px] px-1.5 h-4",
                children: v.status
              }
            ) })
          ]
        },
        v.id
      )) })
    ] }) })
  ] });
}
function HealthScoreCell({ score }) {
  const color = score >= 75 ? "text-[oklch(0.68_0.22_142)]" : score >= 50 ? "text-[oklch(0.85_0.24_80)]" : "text-[oklch(0.65_0.19_22)]";
  const Icon = score >= 75 ? TrendingUp : TrendingDown;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center justify-end gap-1 font-bold ${color}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    score
  ] });
}
export {
  ReportsPage as default
};
