import { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  message,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { SaveOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import {
  getAllRestrictions,
  seedRestrictions,
  upsertRestriction,
} from "../../api/restrictionApi";

const { Title, Text } = Typography;

/* ─── Constants ────────────────────────────────────────────── */
const USER_TYPES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPER_HR",
  "HR",
  "MARKETING",
  "MODERATOR",
  "USER",
];
const EDITABLE_TYPES = USER_TYPES.filter((t) => t !== "SUPER_ADMIN");

const RESOURCES = [
  { key: "dashboard", label: "Dashboard", ops: ["view"] },
  {
    key: "festivals",
    label: "Festivals",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "categorys",
    label: "Categorys",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "businesss",
    label: "Businesss",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "banners",
    label: "Banners",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "demoFrames",
    label: "DemoFrames",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "businessFrames",
    label: "Business Frames",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "clientFrames",
    label: "Client Frames",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "clients",
    label: "Clients",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "employees",
    label: "Employees",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "contactUs",
    label: "Contact Us",
    ops: ["view", "create", "edit", "delete"],
  },
  {
    key: "legalContent",
    label: "Legal Content",
    ops: ["view", "create", "edit", "delete"],
  },
  { key: "imageDownload", label: "Image Download", ops: ["view"] },
];

const SUPER_ADMIN_PERMS = {
  dashboard: { view: true },
  festivals: { view: true, create: true, edit: true, delete: true },
  categorys: { view: true, create: true, edit: true, delete: true },
  businesss: { view: true, create: true, edit: true, delete: true },
  banners: { view: true, create: true, edit: true, delete: true },
  demoFrames: { view: true, create: true, edit: true, delete: true },
  businessFrames: { view: true, create: true, edit: true, delete: true },
  clientFrames: { view: true, create: true, edit: true, delete: true },
  clients: { view: true, create: true, edit: true, delete: true },
  employees: { view: true, create: true, edit: true, delete: true },
  contactUs: { view: true, create: true, edit: true, delete: true },
  legalContent: { view: true, create: true, edit: true, delete: true },
  imageDownload: { view: true },
};

const DEFAULT_PERMS = {
  dashboard: { view: false },
  festivals: { view: false, create: false, edit: false, delete: false },
  categorys: { view: false, create: false, edit: false, delete: false },
  businesss: { view: false, create: false, edit: false, delete: false },
  banners: { view: false, create: false, edit: false, delete: false },
  demoFrames: { view: false, create: false, edit: false, delete: false },
  businessFrames: { view: false, create: false, edit: false, delete: false },
  clientFrames: { view: false, create: false, edit: false, delete: false },
  clients: { view: false, create: false, edit: false, delete: false },
  employees: { view: false, create: false, edit: false, delete: false },
  contactUs: { view: false, create: false, edit: false, delete: false },
  legalContent: { view: false, create: false, edit: false, delete: false },
  imageDownload: { view: false },
};

/* ─── Helpers ───────────────────────────────────────────────── */
const buildInitialState = (docs) => {
  const map = {};
  for (const doc of docs) {
    map[doc.userType] = doc.permissions || DEFAULT_PERMS;
  }
  const state = {};
  for (const ut of USER_TYPES) {
    state[ut] =
      ut === "SUPER_ADMIN"
        ? SUPER_ADMIN_PERMS
        : map[ut]
          ? JSON.parse(JSON.stringify(map[ut]))
          : JSON.parse(JSON.stringify(DEFAULT_PERMS));
  }
  return state;
};

const roleTagColor = {
  SUPER_ADMIN: "red",
  ADMIN: "orange",
  SUPER_HR: "purple",
  HR: "blue",
  MARKETING: "cyan",
  MODERATOR: "green",
  USER: "default",
};

/* ─── ResourceTab ───────────────────────────────────────────── */
function ResourceTab({ resource, data, onChange, saving }) {
  const { key: resKey, ops } = resource;

  /* Column-level "select all" state */
  const getColAll = (op) => {
    const vals = EDITABLE_TYPES.map((ut) => data[ut]?.[resKey]?.[op] ?? false);
    const allTrue = vals.every(Boolean);
    const anyTrue = vals.some(Boolean);
    return { checked: allTrue, indeterminate: anyTrue && !allTrue };
  };

  const handleColAll = (op, checked) => {
    EDITABLE_TYPES.forEach((ut) => onChange(ut, resKey, op, checked));
  };

  const columns = [
    {
      title: <Text strong>Role</Text>,
      dataIndex: "userType",
      key: "userType",
      width: 160,
      render: (ut) => (
        <Tag
          color={roleTagColor[ut] || "default"}
          style={{ minWidth: 90, textAlign: "center" }}
        >
          {ut}
        </Tag>
      ),
    },
    ...ops.map((op) => {
      const { checked, indeterminate } = getColAll(op);
      return {
        title: (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                textTransform: "capitalize",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              {op}
            </div>
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              onChange={(e) => handleColAll(op, e.target.checked)}
              title={`Select / Deselect all (except SUPER_ADMIN)`}
            />
          </div>
        ),
        dataIndex: op,
        key: op,
        align: "center",
        render: (_, record) => {
          const isSuperAdmin = record.userType === "SUPER_ADMIN";
          const val = data[record.userType]?.[resKey]?.[op] ?? false;
          return (
            <Checkbox
              checked={val}
              disabled={isSuperAdmin || saving}
              onChange={(e) =>
                onChange(record.userType, resKey, op, e.target.checked)
              }
            />
          );
        },
      };
    }),
  ];

  const tableData = USER_TYPES.map((ut) => ({ key: ut, userType: ut }));

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      size="middle"
      bordered
      rowClassName={(r) =>
        r.userType === "SUPER_ADMIN" ? "restriction-superadmin-row" : ""
      }
    />
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function Restrictions() {
  const [data, setData] = useState(null); // { userType: permissions }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(RESOURCES[0].key);
  const originalRef = useRef(null); // deep copy of server state

  const [messageApi, contextHolder] = message.useMessage();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAllRestrictions();
      const built = buildInitialState(res.data?.data || []);
      setData(built);
      originalRef.current = JSON.parse(JSON.stringify(built));
    } catch {
      messageApi.error("Failed to load restrictions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (userType, resKey, op, value) => {
    setData((prev) => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [resKey]: {
          ...prev[userType]?.[resKey],
          [op]: value,
        },
      },
    }));
  };

  /* Save all editable userTypes for the current tab (resource) */
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await Promise.all(
        EDITABLE_TYPES.map((ut) => upsertRestriction(ut, data[ut])),
      );
      originalRef.current = JSON.parse(JSON.stringify(data));
      messageApi.success("Permissions saved successfully");
      // Reload from server to ensure consistency
      await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save permissions";
      messageApi.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    try {
      await seedRestrictions();
      messageApi.success("Default restrictions seeded");
      await fetchAll();
    } catch {
      messageApi.error("Failed to seed restrictions");
    }
  };

  const tabItems = RESOURCES.map((res) => ({
    key: res.key,
    label: res.label,
    children: data ? (
      <ResourceTab
        resource={res}
        data={data}
        onChange={handleChange}
        saving={saving}
      />
    ) : null,
  }));

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: "#1890ff" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Role Permissions
          </Title>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            onClick={handleSeed}
            disabled={loading || saving}
            size="small"
          >
            Seed Defaults
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Configure which pages and operations each role can access. SUPER_ADMIN
        always has full access and cannot be edited.
      </Text>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="small"
        />
      )}

      <style>{`
        .restriction-superadmin-row td {
          background: #fff7e6 !important;
        }
      `}</style>
    </div>
  );
}
