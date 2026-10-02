"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Network,
  Sparkles,
  TrendingUp,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import { getOrgUnitTree, listAllEmployees } from "@/lib/backend-api";

const actions = [
  {
    href: "/dashboard/employees/new",
    title: "Add employee",
    description: "Create a new employee record",
    tag: "Onboarding",
    icon: UserRoundPlus,
    tone: "bg-teal-50 text-teal-700 ring-teal-100"
  },
  {
    href: "/dashboard/org-units",
    title: "Manage org units",
    description: "Create or update structure",
    tag: "Planning",
    icon: Network,
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100"
  },
  {
    href: "/dashboard/reports",
    title: "Review reports",
    description: "Open workforce summaries",
    tag: "Insights",
    icon: BriefcaseBusiness,
    tone: "bg-amber-50 text-amber-700 ring-amber-100"
  }
];

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 }
  }
};

const spring = { type: "spring" as const, stiffness: 280, damping: 24 };

export default function WorkforceDashboard() {
  const reduceMotion = useReducedMotion();

  const employeesQuery = useQuery({
    queryKey: ["employees", "dashboard"],
    queryFn: () => listAllEmployees(true)
  });

  const unitsQuery = useQuery({
    queryKey: ["org-units", "tree"],
    queryFn: getOrgUnitTree
  });

  const employees = employeesQuery.data ?? [];
  const activeCount = employees.filter(
    (employee) => employee.status === "active"
  ).length;
  const inactiveCount = employees.filter(
    (employee) => employee.status === "inactive"
  ).length;
  const orgUnitCount = unitsQuery.data?.length ?? 0;

  const metrics = [
    {
      label: "Active employees",
      value: employeesQuery.isLoading ? "..." : activeCount,
      note: "Currently on your team",
      icon: UsersRound,
      tone: "bg-teal-50 text-teal-700",
      trend: "+2.4%"
    },
    {
      label: "New hires",
      value: "06",
      note: "Added this month",
      icon: UserRoundPlus,
      tone: "bg-indigo-50 text-indigo-700",
      trend: "This month"
    },
    {
      label: "Open positions",
      value: "12",
      note: "Across all departments",
      icon: BriefcaseBusiness,
      tone: "bg-amber-50 text-amber-700",
      trend: "Hiring"
    },
    {
      label: "Attendance rate",
      value: "96.4%",
      note: "Workforce average",
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-700",
      trend: "On track"
    }
  ];

  const pipeline = [
    { name: "Screening", count: 8, tone: "bg-indigo-50 text-indigo-700" },
    { name: "Interview", count: 4, tone: "bg-sky-50 text-sky-700" },
    { name: "Offer", count: 2, tone: "bg-amber-50 text-amber-700" },
    { name: "Onboarding", count: 3, tone: "bg-teal-50 text-teal-700" }
  ];

  const priorities = [
    {
      title: "Manager approvals",
      detail: "Two manager sign-offs are due before the next payroll run.",
      level: "High"
    },
    {
      title: "Probation reviews",
      detail: "Three probationary employees require end-of-month follow-up.",
      level: "Medium"
    },
    {
      title: "Training calendar",
      detail: "Leadership sessions are scheduled for next Thursday and Friday.",
      level: "Planned"
    }
  ];

  const snapshots = [
    {
      label: "Headcount trend",
      value: "+8.2%",
      delta: "vs. last quarter"
    },
    {
      label: "Open roles",
      value: "12",
      delta: "3 priority hires"
    },
    {
      label: "Avg. time to hire",
      value: "21d",
      delta: "3 days faster"
    }
  ];

  const complianceItems = [
    "Employee files reviewed for the new quarter",
    "Attendance exceptions flagged for HR follow-up",
    "Compensation change requests pending approval"
  ];

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-6 pb-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.section
        variants={rise}
        transition={{ ...spring, delay: 0.02 }}
        className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-6 py-7 text-white shadow-[0_28px_70px_rgba(49,46,129,0.25)] sm:px-9 sm:py-9"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -12, 0], y: [0, 16, 0] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 14, 0], y: [0, -10, 0] }
          }
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between"
          animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-50 backdrop-blur-md"
              animate={reduceMotion ? undefined : { opacity: [1, 0.8, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
              Workforce health stable
            </motion.div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
              HR dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/80 sm:text-base">
              A fuller overview of workforce activity, structure, and staffing
              health.
            </p>
          </div>

          <motion.div
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
          >
            <Link
              href="/dashboard/reports"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-950 shadow-lg shadow-black/15 hover:bg-indigo-50"
            >
              Workforce summary
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-5 right-8 hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35 xl:flex">
          <span className="h-px w-10 bg-white/25" />
          People, built to grow
        </div>
      </motion.section>

      <motion.section variants={rise} transition={{ ...spring, delay: 0.07 }}>
        <div className="mb-3 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
            Workforce overview
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Your people at a glance
          </h2>
        </div>

        <motion.div
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <motion.article
                key={metric.label}
                variants={rise}
                transition={spring}
                whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_10px_35px_rgba(30,41,59,0.06)] backdrop-blur-xl sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.tone}`}
                  >
                    <Icon aria-hidden="true" size={19} />
                  </span>
                  <span className="rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    {metric.trend}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                  {metric.value}
                </p>
                <p className="mt-1.5 text-xs text-slate-500">{metric.note}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section
        variants={rise}
        transition={{ ...spring, delay: 0.12 }}
        className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-[0_16px_50px_rgba(30,41,59,0.06)] backdrop-blur-xl sm:p-6"
      >
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
              Quick actions
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Start a task
            </h2>
          </div>
          <Sparkles aria-hidden="true" className="mb-1 text-amber-500" size={19} />
        </div>

        <motion.div
          className="grid gap-3 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.div
                key={action.href}
                variants={rise}
                transition={spring}
                whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
              >
                <Link
                  href={action.href}
                  className="group block h-full rounded-2xl border border-white bg-white/75 p-4 shadow-[0_8px_24px_rgba(30,41,59,0.06)] transition hover:border-indigo-200 hover:shadow-[0_18px_38px_rgba(79,70,229,0.12)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${action.tone}`}
                    >
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {action.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-950">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    Open task
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      size={15}
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section
        variants={rise}
        transition={{ ...spring, delay: 0.17 }}
        className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <article className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_16px_50px_rgba(30,41,59,0.06)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                People operations
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                Hiring pipeline
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800 sm:self-auto">
              <CheckCircle2 aria-hidden="true" size={14} />
              On track
            </span>
          </div>

          <motion.div
            className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {pipeline.map((stage) => (
              <motion.div
                key={stage.name}
                variants={rise}
                transition={spring}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="rounded-xl border border-slate-200/70 bg-white/75 p-3.5"
              >
                <p className="text-sm font-medium text-slate-600">{stage.name}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stage.tone}`}
                  >
                    {stage.count} open
                  </span>
                  <span className="text-xs text-slate-400">In progress</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-5 rounded-2xl border border-slate-200/70 bg-slate-50/75 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Team priorities
              </h3>
              <Sparkles aria-hidden="true" className="text-indigo-500" size={15} />
            </div>
            <div className="mt-3 space-y-2.5">
              {priorities.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-white bg-white/80 p-3"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        {item.level}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_16px_50px_rgba(30,41,59,0.06)] backdrop-blur-xl sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
            Team insights
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Staffing snapshot
          </h2>

          <div className="mt-5 space-y-3">
            {snapshots.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200/70 bg-white/75 p-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-teal-700">
                    {item.value}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">{item.delta}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Workforce follow-up
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {employeesQuery.isLoading
                ? "Loading employee details"
                : `${inactiveCount} inactive employees`}
              {unitsQuery.isLoading
                ? " · Loading organization"
                : ` · ${orgUnitCount} org units`}
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
              {[
                "Employee files reviewed for the new quarter",
                "Attendance exceptions flagged for HR follow-up",
                "Compensation change requests pending approval"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </motion.section>

      {employeesQuery.isError && (
        <p role="alert" className="text-sm text-red-700">
          {employeesQuery.error.message}
        </p>
      )}
      {unitsQuery.isError && (
        <p role="alert" className="text-sm text-red-700">
          {unitsQuery.error.message}
        </p>
      )}
    </motion.div>
  );
}