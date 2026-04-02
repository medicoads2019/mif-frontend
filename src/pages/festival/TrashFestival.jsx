import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Breadcrumb,
  Select,
} from "antd";

import {
  getFestivalsBySoftDelete,
  restoreFestival,
  hardDeleteFestival,
} from "../../api/festivalApi";

import { formatIndianDate } from "../../utils/dateFormatter";

const { Title } = Typography;

export default function TrashFestival() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const statusColor = {
    APPROVED: "green",
    PENDING: "blue",
    REJECTED: "red",
    DELETED: "default",
  };

  /* =========================================
     LOAD TRASH FESTIVALS
  ========================================= */
  const loadTrashFestivals = async () => {
    try {
      setLoading(true);

      const res = await getFestivalsBySoftDelete(true);

      setFestivals(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash festivals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashFestivals();
  }, []);

  /* =========================================
     RESTORE FESTIVAL
  ========================================= */
  const handleRestore = async (festivalId) => {
    try {
      await restoreFestival(festivalId);

      message.success("Festival restored successfully");

      setFestivals((prev) => prev.filter((f) => f.festivalId !== festivalId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE FESTIVAL
  ========================================= */
  const handleHardDelete = async (festivalId) => {
    try {
      await hardDeleteFestival(festivalId);

      message.success("Festival permanently deleted");

      setFestivals((prev) => prev.filter((f) => f.festivalId !== festivalId));
    } catch (err) {
      console.error(err);
      message.error("Hard delete failed");
    }
  };

  /* =========================================
     TABLE COLUMNS
  ========================================= */
  const columns = [
    {
      title: "Festival Name",
      dataIndex: "festivalName",
      key: "festivalName",
      align: "left",
    },
    {
      title: "Festival Date",
      dataIndex: "festivalDate",
      key: "festivalDate",
      align: "center",
      render: (date) => formatIndianDate(date),
    },
    {
      title: "Status",
      dataIndex: "festivalStatus",
      key: "festivalStatus",
      align: "center",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          {/* Restore */}
          <Button
            type="primary"
            onClick={() => handleRestore(record.festivalId)}
          >
            Restore
          </Button>

          {/* Hard Delete */}
          <Popconfirm
            title="Permanently delete this festival?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleHardDelete(record.festivalId)}
          >
            <Button danger>Hard Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[{ title: "Festivals" }, { title: "Trash" }]}
      />

      <Card>
        <Title level={4}>Trash Festivals 🗑</Title>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
          <Select
            value={pageSize}
            onChange={setPageSize}
            style={{ minWidth: 120 }}
            options={[
              { label: "10 per page", value: 10 },
              { label: "20 per page", value: 20 },
              { label: "30 per page", value: 30 },
              { label: "40 per page", value: 40 },
              { label: "50 per page", value: 50 },
              { label: "100 per page", value: 100 },
            ]}
          />
        </div>

        <Table
          rowKey="festivalId"
          columns={columns}
          dataSource={festivals}
          loading={loading}
          pagination={{ pageSize }}
        />
      </Card>
    </>
  );
}
