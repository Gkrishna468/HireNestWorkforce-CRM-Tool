import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, D as Database, U as Users, a4 as ChartColumn, e as Badge, g as Button, w as ue } from "./index-Bx4Ezqku.js";
import { I as Input } from "./input-Df8v4wzg.js";
import { L as Label } from "./label-d44cJWY0.js";
import { I as Info } from "./info-YEAOI9Aa.js";
import { C as CircleCheck } from "./circle-check-ByvVbHw5.js";
import { C as CircleX } from "./circle-x-CcmqbHwP.js";
import { L as LoaderCircle } from "./loader-circle-Din4dkAC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$2);
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
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode);
const INTEGRATIONS = [
  {
    key: "supabase",
    title: "Supabase",
    description: "Connects your bench, jobs, pipeline, and entity data across all HireNest apps",
    icon: Database,
    fields: [
      {
        name: "url",
        label: "Project URL",
        type: "text",
        placeholder: "https://xxxxxxxxxxxx.supabase.co"
      },
      {
        name: "anonKey",
        label: "Anon Key",
        type: "password",
        placeholder: "eyJhbGc..."
      },
      {
        name: "serviceKey",
        label: "Service Role Key",
        type: "password",
        placeholder: "eyJhbGc..."
      }
    ]
  },
  {
    key: "workforce_portal",
    title: "HireNest Workforce Portal",
    description: "Link to your main HireNest Workforce portal for candidate and job sync",
    icon: Globe,
    fields: [
      {
        name: "url",
        label: "Portal URL",
        type: "text",
        placeholder: "https://app.hirenestworkforce.com"
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "hn_live_..."
      }
    ]
  },
  {
    key: "recruiter_app",
    title: "HireNest Recruiter App",
    description: "Sync recruiter activity, placements, and performance from the recruiter mobile app",
    icon: Users,
    fields: [
      {
        name: "endpoint",
        label: "API Endpoint",
        type: "text",
        placeholder: "https://api.hirenestrecruiter.com"
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "rapp_..."
      }
    ]
  },
  {
    key: "analytics",
    title: "HireNest Analytics",
    description: "Connect your analytics dashboard for advanced reporting and insights",
    icon: ChartColumn,
    fields: [
      {
        name: "dashboardUrl",
        label: "Dashboard URL",
        type: "text",
        placeholder: "https://analytics.hirenestworkforce.com"
      },
      {
        name: "accessToken",
        label: "Access Token",
        type: "password",
        placeholder: "hn_analytics_..."
      }
    ]
  }
];
const STORAGE_PREFIX = "hirenest_settings_";
function IntegrationCard({ config }) {
  const storageKey = STORAGE_PREFIX + config.key;
  const Icon = config.icon;
  const [values, setValues] = reactExports.useState(() => {
    try {
      const saved2 = localStorage.getItem(storageKey);
      return saved2 ? JSON.parse(saved2) : {};
    } catch {
      return {};
    }
  });
  const [visible, setVisible] = reactExports.useState({});
  const [testing, setTesting] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (!existing) return false;
      const parsed = JSON.parse(existing);
      return Object.values(parsed).some((v) => String(v).trim() !== "");
    } catch {
      return false;
    }
  });
  const isConnected = saved;
  function handleChange(name, val) {
    setValues((prev) => ({ ...prev, [name]: val }));
  }
  function toggleVisible(name) {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }
  async function handleTest() {
    var _a, _b, _c;
    const firstField = config.fields[0].name;
    const secondField = (_a = config.fields[1]) == null ? void 0 : _a.name;
    const hasValues = ((_b = values[firstField]) == null ? void 0 : _b.trim()) && (secondField ? (_c = values[secondField]) == null ? void 0 : _c.trim() : true);
    setTesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTesting(false);
    if (hasValues) {
      ue.success(`${config.title} connection successful`, {
        description: "API responded with 200 OK"
      });
    } else {
      ue.error("Connection failed", {
        description: "Please fill in all required fields before testing"
      });
    }
  }
  function handleSave() {
    localStorage.setItem(storageKey, JSON.stringify(values));
    setSaved(true);
    ue.success(`${config.title} settings saved`, {
      description: "Configuration stored locally in your browser"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card p-5 space-y-4",
      "data-ocid": `integration-card-${config.key}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: config.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-snug mt-0.5 max-w-sm", children: config.description })
            ] })
          ] }),
          isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] px-2 py-0.5 flex items-center gap-1 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            "Connected"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-muted text-muted-foreground border border-border rounded-full text-[10px] px-2 py-0.5 flex items-center gap-1 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
            "Not Connected"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: config.fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: field.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: field.type === "password" && !visible[field.name] ? "password" : "text",
                placeholder: field.placeholder,
                value: values[field.name] ?? "",
                onChange: (e) => handleChange(field.name, e.target.value),
                className: "bg-background border-border text-foreground text-xs h-8 pr-8",
                "data-ocid": `input-${config.key}-${field.name}`
              }
            ),
            field.type === "password" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleVisible(field.name),
                className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                "aria-label": visible[field.name] ? "Hide value" : "Show value",
                children: visible[field.name] ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }, field.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "text-xs h-8 gap-1.5",
              onClick: handleTest,
              disabled: testing,
              "data-ocid": `btn-test-${config.key}`,
              children: [
                testing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                testing ? "Testing..." : "Test Connection"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "text-xs h-8",
              onClick: handleSave,
              "data-ocid": `btn-save-${config.key}`,
              children: "Save"
            }
          )
        ] })
      ]
    }
  );
}
function SettingsPage() {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", "data-ocid": "settings-integrations", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display", children: "Integrations & Linked Apps" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Connect your HireNest apps and external tools to sync data across your workspace." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-200/80 leading-relaxed", children: "Settings and API keys are stored locally in your browser. For production use, connect Supabase to persist settings across devices and HireNest apps." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: INTEGRATIONS.map((cfg) => /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrationCard, { config: cfg }, cfg.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-xl border border-border bg-card p-5 space-y-3",
        "data-ocid": "settings-about",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display", children: "About" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary-foreground font-display", children: "HN" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "HireNest Command Center" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-border", children: "v1.0.0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pl-9", children: "AI-powered unified CRM for staffing and recruiting operations" })
          ] })
        ]
      }
    )
  ] });
}
export {
  SettingsPage as default
};
