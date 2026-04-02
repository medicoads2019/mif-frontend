import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  CalendarOutlined,
  PlusOutlined,
  PictureOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  UserOutlined,
  DownloadOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  FileTextOutlined,
  MobileOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { normalizeRole } from "../auth/rbac";

const { Sider } = Layout;

/* =========================================
⭐ Sidebar Menu Configuration
========================================= */

const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/dashboard-summary",
    icon: <BarChartOutlined />,
    label: "Dashboard Summary",
  },

  /* ⭐ Festivals */
  {
    key: "festival",
    icon: <CalendarOutlined />,
    label: "Festivals",
    children: [
      {
        key: "/festivals",
        icon: <UnorderedListOutlined />,
        label: "Festival List",
      },
      {
        key: "/festivals/create",
        icon: <PlusOutlined />,
        label: "Create Festival",
      },
      {
        key: "/festivals/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Categorys */
  {
    key: "category",
    icon: <CalendarOutlined />,
    label: "Categorys",
    children: [
      {
        key: "/categorys",
        icon: <UnorderedListOutlined />,
        label: "Category List",
      },
      {
        key: "/categorys/create",
        icon: <PlusOutlined />,
        label: "Create Category",
      },
      {
        key: "/categorys/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Businesss */
  {
    key: "business",
    icon: <CalendarOutlined />,
    label: "Businesss",
    children: [
      {
        key: "/businesss",
        icon: <UnorderedListOutlined />,
        label: "Business List",
      },
      {
        key: "/businesss/create",
        icon: <PlusOutlined />,
        label: "Create Business",
      },
      {
        key: "/businesss/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Banners */
  {
    key: "banner",
    icon: <PictureOutlined />,
    label: "Banners",
    children: [
      {
        key: "/banners",
        icon: <UnorderedListOutlined />,
        label: "Banner List",
      },
      {
        key: "/banners/create",
        icon: <PlusOutlined />,
        label: "Create Banner",
      },
      {
        key: "/banners/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ DemoFrames */
  /* ⭐ Start Screen Images */
  {
    key: "startScreenImage",
    icon: <MobileOutlined />,
    label: "Start Screen Images",
    children: [
      {
        key: "/start-screen-images",
        icon: <UnorderedListOutlined />,
        label: "Image List",
      },
      {
        key: "/start-screen-images/create",
        icon: <PlusOutlined />,
        label: "Add Image",
      },
      {
        key: "/start-screen-images/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ DemoFrames */
  {
    key: "demoFrame",
    icon: <PictureOutlined />,
    label: "DemoFrames",
    children: [
      {
        key: "/demoFrames",
        icon: <UnorderedListOutlined />,
        label: "DemoFrame List",
      },
      {
        key: "/demoFrames/create",
        icon: <PlusOutlined />,
        label: "Create DemoFrame",
      },
      {
        key: "/demoFrames/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ BusinessFrames */
  {
    key: "businessFrame",
    icon: <AppstoreOutlined />,
    label: "Business Frames",
    children: [
      {
        key: "/businessFrames",
        icon: <UnorderedListOutlined />,
        label: "Business Frame List",
      },
      {
        key: "/businessFrames/create",
        icon: <PlusOutlined />,
        label: "Create Business Frame",
      },
      {
        key: "/businessFrames/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ ClientFrames */
  {
    key: "clientFrame",
    icon: <AppstoreOutlined />,
    label: "Client Frames",
    children: [
      {
        key: "/clientFrames",
        icon: <UnorderedListOutlined />,
        label: "Client Frame List",
      },
      {
        key: "/clientFrames/create",
        icon: <PlusOutlined />,
        label: "Create Client Frame",
      },
      {
        key: "/clientFrames/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Clients */
  {
    key: "client",
    icon: <UserOutlined />,
    label: "Clients",
    children: [
      {
        key: "/clients",
        icon: <UnorderedListOutlined />,
        label: "Client List",
      },
      {
        key: "/clients/create",
        icon: <PlusOutlined />,
        label: "Create Client",
      },
      {
        key: "/clients/login-testing",
        icon: <UnorderedListOutlined />,
        label: "Client Login Testing",
      },
      {
        key: "/clients/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Employees */
  {
    key: "employee",
    icon: <UserOutlined />,
    label: "Employees",
    children: [
      {
        key: "/employees",
        icon: <UnorderedListOutlined />,
        label: "Employee List",
      },
      {
        key: "/employees/create",
        icon: <PlusOutlined />,
        label: "Create Employee",
      },
      {
        key: "/employees/login-testing",
        icon: <UnorderedListOutlined />,
        label: "Employee Login Testing",
      },
      {
        key: "/employees/trash",
        icon: <DeleteOutlined />,
        label: "Trash",
      },
    ],
  },

  /* ⭐ Image Download */
  {
    key: "/image-download",
    icon: <DownloadOutlined />,
    label: "Image Download",
  },

  /* ⭐ Contact Us */
  {
    key: "/contact-us",
    icon: <PhoneOutlined />,
    label: "Contact Us",
  },

  {
    key: "/legal-content",
    icon: <FileTextOutlined />,
    label: "Legal Content",
  },

  /* ⭐ Restrictions */
  {
    key: "/restrictions",
    icon: <SafetyCertificateOutlined />,
    label: "Restrictions",
  },
];

/* =========================================
⭐ Resolve Selected Menu Item
========================================= */

const resolveSelectedKey = (pathname) => {
  if (
    pathname.startsWith("/festivals/") &&
    pathname !== "/festivals/create" &&
    pathname !== "/festivals/trash"
  )
    return "/festivals";

  if (
    pathname.startsWith("/categorys/") &&
    pathname !== "/categorys/create" &&
    pathname !== "/categorys/trash"
  )
    return "/categorys";

  if (
    pathname.startsWith("/businesss/") &&
    pathname !== "/businesss/create" &&
    pathname !== "/businesss/trash"
  )
    return "/businesss";

  if (
    pathname.startsWith("/banners/") &&
    pathname !== "/banners/create" &&
    pathname !== "/banners/trash"
  )
    return "/banners";

  if (
    pathname.startsWith("/start-screen-images/") &&
    pathname !== "/start-screen-images/create" &&
    pathname !== "/start-screen-images/trash"
  )
    return "/start-screen-images";

  if (
    pathname.startsWith("/demoFrames/") &&
    pathname !== "/demoFrames/create" &&
    pathname !== "/demoFrames/trash"
  )
    return "/demoFrames";

  if (
    pathname.startsWith("/businessFrames/") &&
    pathname !== "/businessFrames/create" &&
    pathname !== "/businessFrames/trash"
  )
    return "/businessFrames";

  if (
    pathname.startsWith("/clientFrames/") &&
    pathname !== "/clientFrames/create" &&
    pathname !== "/clientFrames/trash"
  )
    return "/clientFrames";

  if (
    pathname.startsWith("/clients/") &&
    pathname !== "/clients/create" &&
    pathname !== "/clients/trash" &&
    pathname !== "/clients/login-testing"
  )
    return "/clients";

  if (pathname === "/clients/login-testing") return "/clients/login-testing";

  if (
    pathname.startsWith("/employees/") &&
    pathname !== "/employees/create" &&
    pathname !== "/employees/trash" &&
    pathname !== "/employees/login-testing"
  )
    return "/employees";

  if (pathname === "/employees/login-testing")
    return "/employees/login-testing";

  return pathname;
};

/* =========================================
⭐ Resolve Open Menu Section
========================================= */

const resolveOpenKeys = (pathname) => {
  if (pathname.startsWith("/festivals")) return ["festival"];
  if (pathname.startsWith("/categorys")) return ["category"];
  if (pathname.startsWith("/businesss")) return ["business"];
  if (pathname.startsWith("/banners")) return ["banner"];
  if (pathname.startsWith("/start-screen-images")) return ["startScreenImage"];
  if (pathname.startsWith("/demoFrames")) return ["demoFrame"];
  if (pathname.startsWith("/businessFrames")) return ["businessFrame"];
  if (pathname.startsWith("/clientFrames")) return ["clientFrame"];
  if (pathname.startsWith("/clients")) return ["client"];
  if (pathname.startsWith("/employees")) return ["employee"];
  return [];
};

/* =========================================
⭐ Sidebar Component
========================================= */

export default function AppSidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const selectedKey = resolveSelectedKey(location.pathname);
  const openKeys = resolveOpenKeys(location.pathname);

  const filteredMenuItems = useMemo(() => {
    const normalizedRole = normalizeRole(role);

    if (["ADMIN", "SUPER_ADMIN"].includes(normalizedRole)) {
      return menuItems;
    }

    if (["HR", "SUPER_HR"].includes(normalizedRole)) {
      return menuItems.filter((item) =>
        ["client", "employee"].includes(item.key),
      );
    }

    if (normalizedRole === "USER") {
      return menuItems.filter((item) => item.key === "client");
    }

    return [];
  }, [role]);

  return (
    <Sider
      collapsed={collapsed}
      collapsible
      trigger={null}
      width={230}
      style={{
        background: "linear-gradient(180deg,#001529 0%,#000c17 100%)",
      }}
    >
      {/* ⭐ Logo */}
      <div
        style={{
          height: 64,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? 0 : "0 16px",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: 0.4,
        }}
      >
        {collapsed ? "MIF" : "MyIndianFestivals"}
      </div>

      {/* ⭐ Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={filteredMenuItems}
        onClick={({ key }) => {
          if (
            ![
              "festival",
              "category",
              "business",
              "banner",
              "demoFrame",
              "businessFrame",
              "clientFrame",
              "client",
              "employee",
            ].includes(key)
          ) {
            navigate(key);
          }
        }}
      />
    </Sider>
  );
}
