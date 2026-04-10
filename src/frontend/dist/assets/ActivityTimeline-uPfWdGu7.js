import { c as createLucideIcon, j as jsxRuntimeExports, f as cn, U as Users } from "./index-B7B8aExa.js";
import { f as formatRelativeTime } from "./format-BLMMf4Z3.js";
import { F as FileText } from "./file-text-DOwd0feI.js";
import { C as CalendarCheck, S as Send } from "./send-53Z5lp7S.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
];
const GitBranch = createLucideIcon("git-branch", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$2);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$1);
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
const ACTIVITY_CONFIG = {
  call: {
    icon: Phone,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    label: "Call"
  },
  email: {
    icon: Mail,
    color: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20",
    label: "Email"
  },
  meeting: {
    icon: Users,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    label: "Meeting"
  },
  submission: {
    icon: Send,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    label: "Submission"
  },
  interview: {
    icon: CalendarCheck,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    label: "Interview"
  },
  note: {
    icon: FileText,
    color: "text-muted-foreground bg-muted border-border",
    label: "Note"
  },
  stage_change: {
    icon: GitBranch,
    color: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20",
    label: "Stage Change"
  }
};
function ActivityTimeline({
  activities,
  emptyMessage = "No activities recorded yet.",
  className
}) {
  if (activities.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "flex items-center justify-center py-8 text-sm text-muted-foreground",
          className
        ),
        children: emptyMessage
      }
    );
  }
  const sorted = [...activities].sort((a, b) => b.createdAt - a.createdAt);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("space-y-1", className), "data-ocid": "activity-timeline", children: sorted.map((activity) => {
    const config = ACTIVITY_CONFIG[activity.activityType] ?? ACTIVITY_CONFIG.note;
    const Icon = config.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "mt-0.5 flex-shrink-0 w-6 h-6 rounded-sm border flex items-center justify-center",
            config.color
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border",
                config.color
              ),
              children: config.label
            }
          ),
          activity.direction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground capitalize", children: activity.direction }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground ml-auto flex-shrink-0", children: formatRelativeTime(activity.createdAt) })
        ] }),
        activity.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mt-1 leading-snug", children: activity.notes }),
        activity.createdBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
          "by ",
          activity.createdBy
        ] })
      ] })
    ] }, activity.id);
  }) });
}
export {
  ArrowLeft as A,
  Mail as M,
  Pen as P,
  Phone as a,
  ActivityTimeline as b
};
