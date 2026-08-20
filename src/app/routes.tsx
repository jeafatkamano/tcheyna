import { createBrowserRouter } from "react-router";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { LoginPage } from "./pages/LoginPage";
import { OnboardingTenant } from "./pages/OnboardingTenant";
import { OnboardingOwner } from "./pages/OnboardingOwner";
import { TenantDashboard } from "./pages/TenantDashboard";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingDetail } from "./pages/ListingDetail";
import { TenantProfile } from "./pages/TenantProfile";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { OwnerListing } from "./pages/OwnerListing";
import { MatchingPage } from "./pages/MatchingPage";
import { MessagingPage, MessagesList } from "./pages/MessagingPage";
import { TenantProfileView } from "./pages/TenantProfileView";

// ─── Tenant Shell ───────────────────────────────────────────────────────────

function TenantShell() {
  const navigate = useNavigate();
  return (
    <Layout
      userRole="tenant"
      onRoleSwitch={() => navigate("/owner/dashboard")}
    >
      <Outlet />
    </Layout>
  );
}

function OwnerShell() {
  const navigate = useNavigate();
  return (
    <Layout
      userRole="landlord"
      onRoleSwitch={() => navigate("/tenant/dashboard")}
    >
      <Outlet />
    </Layout>
  );
}

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: LoginPage },
  { path: "/onboarding/tenant", Component: OnboardingTenant },
  { path: "/onboarding/owner", Component: OnboardingOwner },

  // Tenant routes
  {
    path: "/tenant",
    Component: TenantShell,
    children: [
      { path: "dashboard", Component: TenantDashboard },
      { path: "listings", Component: ListingsPage },
      { path: "profile", Component: TenantProfile },
      { path: "messages", Component: MessagesList },
    ],
  },

  // Owner routes
  {
    path: "/owner",
    Component: OwnerShell,
    children: [
      { path: "dashboard", Component: OwnerDashboard },
      { path: "listing", Component: OwnerListing },
      { path: "matches", Component: MatchingPage },
      { path: "messages", Component: MessagesList },
    ],
  },

  // Shared routes (no shell nav for detail pages)
  { path: "/listing/:id", Component: ListingDetail },
  { path: "/messages/:matchId", Component: MessagingPage },
  { path: "/tenant-profile/:id", Component: TenantProfileView },
]);
