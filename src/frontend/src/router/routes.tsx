import { Layout } from "@/components/layout/Layout";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy page imports
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const VendorsPage = lazy(() => import("@/pages/VendorsPage"));
const VendorDetailPage = lazy(() => import("@/pages/VendorDetailPage"));
const ClientsPage = lazy(() => import("@/pages/ClientsPage"));
const ClientDetailPage = lazy(() => import("@/pages/ClientDetailPage"));
const RecruitersPage = lazy(() => import("@/pages/RecruitersPage"));
const RecruiterDetailPage = lazy(() => import("@/pages/RecruiterDetailPage"));
const CandidatesPage = lazy(() => import("@/pages/CandidatesPage"));
const CandidateDetailPage = lazy(() => import("@/pages/CandidateDetailPage"));
const JobsPage = lazy(() => import("@/pages/JobsPage"));
const BenchPage = lazy(() => import("@/pages/BenchPage"));
const FollowUpsPage = lazy(() => import("@/pages/FollowUpsPage"));
const ApprovalsPage = lazy(() => import("@/pages/ApprovalsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const SqlEditorPage = lazy(() => import("@/pages/SqlEditorPage"));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoadingSpinner />}>{children}</Suspense>;
}

// Root layout route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/dashboard" replace />,
});

// Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <PageWrapper>
      <DashboardPage />
    </PageWrapper>
  ),
});

// Vendors
const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendors",
  component: () => (
    <PageWrapper>
      <VendorsPage />
    </PageWrapper>
  ),
});

const vendorDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendors/$vendorId",
  component: () => (
    <PageWrapper>
      <VendorDetailPage />
    </PageWrapper>
  ),
});

// Clients
const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients",
  component: () => (
    <PageWrapper>
      <ClientsPage />
    </PageWrapper>
  ),
});

const clientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients/$clientId",
  component: () => (
    <PageWrapper>
      <ClientDetailPage />
    </PageWrapper>
  ),
});

// Recruiters
const recruitersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recruiters",
  component: () => (
    <PageWrapper>
      <RecruitersPage />
    </PageWrapper>
  ),
});

const recruiterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recruiters/$recruiterId",
  component: () => (
    <PageWrapper>
      <RecruiterDetailPage />
    </PageWrapper>
  ),
});

// Candidates
const candidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidates",
  component: () => (
    <PageWrapper>
      <CandidatesPage />
    </PageWrapper>
  ),
});

const candidateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidates/$candidateId",
  component: () => (
    <PageWrapper>
      <CandidateDetailPage />
    </PageWrapper>
  ),
});

// Jobs
const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: () => (
    <PageWrapper>
      <JobsPage />
    </PageWrapper>
  ),
});

// Bench
const benchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bench",
  component: () => (
    <PageWrapper>
      <BenchPage />
    </PageWrapper>
  ),
});

// Follow-ups
const followUpsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/follow-ups",
  component: () => (
    <PageWrapper>
      <FollowUpsPage />
    </PageWrapper>
  ),
});

// Approvals
const approvalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/approvals",
  component: () => (
    <PageWrapper>
      <ApprovalsPage />
    </PageWrapper>
  ),
});

// Reports
const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <PageWrapper>
      <ReportsPage />
    </PageWrapper>
  ),
});

// Settings
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <PageWrapper>
      <SettingsPage />
    </PageWrapper>
  ),
});

// SQL Editor
const sqlEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sql-editor",
  component: () => (
    <PageWrapper>
      <SqlEditorPage />
    </PageWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  vendorsRoute,
  vendorDetailRoute,
  clientsRoute,
  clientDetailRoute,
  recruitersRoute,
  recruiterDetailRoute,
  candidatesRoute,
  candidateDetailRoute,
  jobsRoute,
  benchRoute,
  followUpsRoute,
  approvalsRoute,
  reportsRoute,
  settingsRoute,
  sqlEditorRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
