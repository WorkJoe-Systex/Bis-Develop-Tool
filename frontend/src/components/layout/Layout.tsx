import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  // Sidebar 寬度
  const sidebarWidth = collapsed ? 60 : 200;
  const headerHeight = 60; // Tailwind h-16

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 text-white h-full"
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </motion.aside>

      {/* 主畫面：包含 Header + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (會跟 Sidebar 一起動) */}
        <motion.div
          // animate={{ paddingLeft: sidebarWidth }}
          transition={{ duration: 0.3 }}
        >
          <Header />
        </motion.div>

        {/* Content 區塊 */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-6"
          style={{ paddingTop: headerHeight }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
