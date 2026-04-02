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
  getBusinessFramesBySoftDelete,
  restoreBusinessFrame,
  hardDeleteBusinessFrame,
} from "../../api/businessFrameApi";

const { Title } = Typography;

export default function TrashBusinessFrame() {
  const [businessFrames, setBusinessFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const statusColor = {
    APPROVED: "green",
    PENDING: "blue",
    REJECTED: "red",
    DELETED: "default",
  };

  /* =========================================
     LOAD TRASH BUSINESS FRAMES
  ========================================= */
  const loadTrash = async () => {
    try {
      setLoading(true);

      const res = await getBusinessFramesBySoftDelete(true);

      setBusinessFrames(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash business frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  /* =========================================
     RESTORE BUSINESS FRAME
  ========================================= */
  const handleRestore = async (businessFrameId) => {
    try {
      await restoreBusinessFrame(businessFrameId);

      message.success("Business frame restored successfully");

      setBusinessFrames((prev) =>
        prev.filter((bf) => bf.businessFrameId !== businessFrameId),
      );
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE BUSINESS FRAME
  ========================================= */
  const handleHardDelete = async (businessFrameId) => {
    try {
      await hardDeleteBusinessFrame(businessFrameId);

      message.success("Business frame permanently deleted");

      setBusinessFrames((prev) =>
        prev.filter((bf) => bf.businessFrameId !== businessFrameId),
      );
    } catch (err) {
      console.error(err);
      message.error("Hard delete failed");
    }
  };

  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      render: (_, __, index) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Business Frame Name",
      dataIndex: "businessFrameName",
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "businessFrameStatus",
      align: "center",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Restore this business frame?"
            onConfirm={() => handleRestore(record.businessFrameId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this business frame? This cannot be undone."
            onConfirm={() => handleHardDelete(record.businessFrameId)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
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
        items={[
          { title: "Dashboard" },
          { title: "Business Frames" },
          { title: "Trash" },
        ]}
      />

      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Trash — Business Frames
        </Title>

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
          rowKey="businessFrameId"
          columns={columns}
          dataSource={businessFrames}
          loading={loading}
          pagination={{ pageSize }}
          bordered
          size="small"
        />
      </Card>
    </>
  );
}
