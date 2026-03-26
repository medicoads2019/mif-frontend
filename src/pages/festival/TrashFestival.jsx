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
    },
    {
      title: "Festival Date",
      dataIndex: "festivalDate",
      key: "festivalDate",
      render: (date) => formatIndianDate(date),
    },
    {
      title: "Status",
      dataIndex: "festivalStatus",
      key: "festivalStatus",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Action",
      key: "action",
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

        <Table
          rowKey="festivalId"
          columns={columns}
          dataSource={festivals}
          loading={loading}
        />
      </Card>
    </>
  );
}
