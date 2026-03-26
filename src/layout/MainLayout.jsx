import { Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

const { Content } = Layout;

/**
 * =========================================
 * ⭐ MainLayout
 * =========================================
 * Responsibilities:
 *  - Sidebar shell
 *  - Header shell
 *  - Content wrapper
 *  - Collapsed state control
 */
export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ⭐ Sidebar */}
      <AppSidebar collapsed={collapsed} />

      {/* ⭐ Right side */}
      <Layout>
        {/* ⭐ Header */}
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* ⭐ Content */}
        <Content
          style={{
            margin: 16,
            padding: 20,
            background: "#f5f7fa",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {/* ⭐ Page card wrapper */}
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              minHeight: "100%",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
