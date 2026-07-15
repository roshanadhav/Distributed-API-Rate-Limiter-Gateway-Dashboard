import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <div className={`gw-root ${theme === "light" ? "light" : ""}`} onClick={() => setNotifOpen(false)}>
      <div className="gw-shell">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="gw-main">
          <Topbar notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
          <div className="gw-page">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
