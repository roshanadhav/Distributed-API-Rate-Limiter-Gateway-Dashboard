import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { EngineProvider } from "./context/EngineContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

import OverviewPage from "./pages/OverviewPage.jsx";
import ArchitecturePage from "./pages/ArchitecturePage.jsx";
import GatewayPage from "./pages/GatewayPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import LoadBalancerPage from "./pages/LoadBalancerPage.jsx";
import RateLimiterPage from "./pages/RateLimiterPage.jsx";
import HealthCheckerPage from "./pages/HealthCheckerPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <EngineProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/gateway" element={<GatewayPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServicesPage />} />
            <Route path="/loadbalancer" element={<LoadBalancerPage />} />
            <Route path="/ratelimiter" element={<RateLimiterPage />} />
            <Route path="/healthchecker" element={<HealthCheckerPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </EngineProvider>
    </ThemeProvider>
  );
}
