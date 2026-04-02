import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Table, Tag, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { getAllFestivals } from "../api/festivalApi";
import { getAllCategorys } from "../api/categoryApi";
import { getAllBusinesss } from "../api/businessApi";
import { getAllBanners } from "../api/bannerApi";
import { getAllDemoFrames } from "../api/demoFrameApi";
import { getAllBusinessFrames } from "../api/businessFrameApi";
import { getAllClientFrames } from "../api/clientFrameApi";
import { getAllClients } from "../api/clientApi";
import { getAllEmployees } from "../api/employeeApi";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../auth/AuthContext";
import { normalizeRole } from "../auth/rbac";

const { Text } = Typography;

const STANDARD_STATUS_KEYS = [
  "festivals",
  "categorys",
  "businesss",
  "banners",
  "demoFrames",
  "businessFrames",
  "clientFrames",
];

const SUMMARY_CONFIG = [
  {
    key: "festivals",
    title: "Festivals",
    statusField: "festivalStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllFestivals,
  },
  {
    key: "categorys",
    title: "Categorys",
    statusField: "categoryStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllCategorys,
  },
  {
    key: "businesss",
    title: "Businesss",
    statusField: "businessStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllBusinesss,
  },
  {
    key: "banners",
    title: "Banners",
    statusField: "bannerStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllBanners,
  },
  {
    key: "demoFrames",
    title: "DemoFrames",
    statusField: "demoFrameStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllDemoFrames,
  },
  {
    key: "businessFrames",
    title: "BusinessFrames",
    statusField: "businessFrameStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllBusinessFrames,
  },
  {
    key: "clientFrames",
    title: "ClientFrames",
    statusField: "clientFrameStatus",
    roles: ["ADMIN", "SUPER_ADMIN"],
    request: getAllClientFrames,
  },
  {
    key: "clients",
    title: "Clients",
    statusField: "clientStatus",
    roles: ["ADMIN", "SUPER_ADMIN", "HR", "SUPER_HR", "USER"],
    request: getAllClients,
  },
  {
    key: "employees",
    title: "Employees",
    statusField: "userStatus",
    roles: ["ADMIN", "SUPER_ADMIN", "HR", "SUPER_HR"],
    request: getAllEmployees,
  },
];

const extractStatusCounts = (response, statusField, serviceKey) => {
  const list = response?.data?.data;
  if (!Array.isArray(list)) return { pending: 0, active: 0, rejected: 0 };

  const isStandard = STANDARD_STATUS_KEYS.includes(serviceKey);

  let pending = 0,
    active = 0,
    rejected = 0;
  for (const item of list) {
    const s = item[statusField];
    if (isStandard) {
      if (s === "PENDING") pending++;
      else if (s === "APPROVED") active++;
      else if (s === "REJECTED") rejected++;
    } else {
      if (s === "PENDING") pending++;
      else if (s === "ACTIVE") active++;
      else if (s === "BLOCKED" || s === "SUSPENDED") rejected++;
    }
  }
  return { pending, active, rejected };
};

export default function DashboardSummary() {
  const [loading, setLoading] = useState(false);
  const [summaryMap, setSummaryMap] = useState({});
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const { role } = useAuth();

  const normalizedRole = normalizeRole(role);

  const visibleServices = useMemo(
    () => SUMMARY_CONFIG.filter((item) => item.roles.includes(normalizedRole)),
    [normalizedRole],
  );

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);

      const settled = await Promise.allSettled(
        visibleServices.map(async (service) => {
          const response = await service.request();
          return {
            key: service.key,
            ...extractStatusCounts(response, service.statusField, service.key),
            error: "",
          };
        }),
      );

      const nextSummaryMap = {};

      settled.forEach((result, index) => {
        const service = visibleServices[index];
        if (!service) return;
        if (result.status === "fulfilled") {
          nextSummaryMap[service.key] = result.value;
        } else {
          nextSummaryMap[service.key] = {
            key: service.key,
            pending: 0,
            active: 0,
            rejected: 0,
            error: "Failed to load",
          };
        }
      });

      setSummaryMap(nextSummaryMap);
      setLastSyncAt(new Date());
    } finally {
      setLoading(false);
    }
  }, [visibleServices]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const tableData = visibleServices.map((service, idx) => {
    const summary = summaryMap[service.key];
    return {
      key: service.key,
      srNo: idx + 1,
      category: service.title,
      pending: summary?.error ? "--" : (summary?.pending ?? 0),
      active: summary?.error ? "--" : (summary?.active ?? 0),
      rejected: summary?.error ? "--" : (summary?.rejected ?? 0),
      error: summary?.error || "",
    };
  });

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      width: 80,
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "category",
      align: "left",
      render: (name, record) =>
        record.error ? (
          <span>
            {name} <Tag color="red">Error</Tag>
          </span>
        ) : (
          name
        ),
    },
    {
      title: "Pending",
      dataIndex: "pending",
      align: "center",
      render: (val) => (
        <Tag color="orange" style={{ minWidth: 36, textAlign: "center" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      align: "center",
      render: (val) => (
        <Tag color="green" style={{ minWidth: 36, textAlign: "center" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Rejected",
      dataIndex: "rejected",
      align: "center",
      render: (val) => (
        <Tag color="red" style={{ minWidth: 36, textAlign: "center" }}>
          {val}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard Summary"
        breadcrumb={["Dashboard", "Summary"]}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchSummary}
            loading={loading}
          >
            Refresh Summary
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={false}
          bordered
          size="small"
        />
      </Card>

      <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
        Last synced:{" "}
        {lastSyncAt ? lastSyncAt.toLocaleString() : "Not synced yet"}
      </Text>
    </>
  );
}
