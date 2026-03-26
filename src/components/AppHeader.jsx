import { Layout, Button, Avatar, Dropdown, Space, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { employeeLogout } from "../api/employeeAuthApi";

const { Header } = Layout;
const { Title } = Typography;

/**
 * =========================================
 * ⭐ Route → Title Mapping
 * =========================================
 */
const routeTitleMap = {
  "/": "Dashboard",

  /* Festivals */
  "/festivals": "Festivals",
  "/festivals/create": "Create Festival",
  "/festivals/trash": "Festival Trash",

  /* Categorys */
  "/categorys": "Categorys",
  "/categorys/create": "Create Category",
  "/categorys/trash": "Category Trash",

  /* Businesss */
  "/businesss": "Businesss",
  "/businesss/create": "Create Business",
  "/businesss/trash": "Business Trash",

  /* Banners */
  "/banners": "Banners",
  "/banners/create": "Create Banner",
  "/banners/trash": "Banner Trash",

  /* DemoFrames */
  "/demoFrames": "DemoFrames",
  "/demoFrames/create": "Create DemoFrame",
  "/demoFrames/trash": "DemoFrame Trash",

  /* BusinessFrames */
  "/businessFrames": "Business Frames",
  "/businessFrames/create": "Create Business Frame",
  "/businessFrames/trash": "Business Frame Trash",

  /* Clients */
  "/clients": "Clients",
  "/clients/create": "Create Client",
  "/clients/trash": "Client Trash",
  "/clients/login-testing": "Client Login Testing",

  /* Employees */
  "/employees": "Employees",
  "/employees/create": "Create Employee",
  "/employees/trash": "Employee Trash",
  "/employees/login-testing": "Employee Login Testing",

  /* Profile */
  "/profile/update": "Update Profile",
  "/profile/change-password": "Change Password",
  "/profile/reset-password": "Reset Password",
  "/unauthorized": "Access Denied",
};

/**
 * =========================================
 * ⭐ Dynamic Title Resolver
 * =========================================
 */
const resolveTitle = (pathname) => {
  if (routeTitleMap[pathname]) return routeTitleMap[pathname];

  /* Edit routes */
  if (
    pathname.startsWith("/festivals/") &&
    pathname !== "/festivals/create" &&
    pathname !== "/festivals/trash"
  )
    return "Edit Festival";
  if (
    pathname.startsWith("/categorys/") &&
    pathname !== "/categorys/create" &&
    pathname !== "/categorys/trash"
  )
    return "Edit Category";
  if (
    pathname.startsWith("/businesss/") &&
    pathname !== "/businesss/create" &&
    pathname !== "/businesss/trash"
  )
    return "Edit Business";
  if (
    pathname.startsWith("/banners/") &&
    pathname !== "/banners/create" &&
    pathname !== "/banners/trash"
  )
    return "Edit Banner";
  if (
    pathname.startsWith("/demoFrames/") &&
    pathname !== "/demoFrames/create" &&
    pathname !== "/demoFrames/trash"
  )
    return "Edit DemoFrame";
  if (
    pathname.startsWith("/businessFrames/") &&
    pathname !== "/businessFrames/create" &&
    pathname !== "/businessFrames/trash"
  )
    return "Edit Business Frame";

  if (
    pathname.startsWith("/clients/") &&
    pathname !== "/clients/create" &&
    pathname !== "/clients/trash" &&
    pathname !== "/clients/login-testing"
  )
    return "Edit Client";

  if (
    pathname.startsWith("/employees/") &&
    pathname !== "/employees/create" &&
    pathname !== "/employees/trash" &&
    pathname !== "/employees/login-testing"
  )
    return "Edit Employee";

  return "Dashboard";
};

/**
 * =========================================
 * ⭐ AppHeader Component
 * =========================================
 */
export default function AppHeader({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee, logout, token } = useAuth();
  const title = resolveTitle(location.pathname);

  /**
   * ⭐ Dropdown Menu
   */
  const menuItems = [
    {
      key: "profile-update",
      icon: <EditOutlined />,
      label: "Update Profile",
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: "Change Password",
    },
    {
      key: "reset-password",
      icon: <KeyOutlined />,
      label: "Reset Password",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleMenuClick = async ({ key }) => {
    if (key === "profile-update") {
      navigate("/profile/update");
      return;
    }

    if (key === "change-password") {
      navigate("/profile/change-password");
      return;
    }

    if (key === "reset-password") {
      navigate("/profile/reset-password");
      return;
    }

    if (key === "logout") {
      try {
        await employeeLogout(token);
      } catch {}
      logout();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* ⭐ Left */}
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />

        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>

      {/* ⭐ Right */}
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={["click"]}
      >
        <Space style={{ cursor: "pointer" }}>
          <Avatar style={{ background: "#1677ff" }} icon={<UserOutlined />} />
          {employee?.firstName || employee?.email || "Employee"}
        </Space>
      </Dropdown>
    </Header>
  );
}
