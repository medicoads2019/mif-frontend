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
  getBusinessFramesBySoftDelete,
  restoreBusinessFrame,
  hardDeleteBusinessFrame,
} from "../../api/businessFrameApi";

const { Title } = Typography;

export default function TrashBusinessFrame() {
  const [businessFrames, setBusinessFrames] = useState([]);
  const [loading, setLoading] = useState(false);

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
    },
    {
      title: "Business Frame Name",
      dataIndex: "businessFrameName",
    },
    {
      title: "Status",
      dataIndex: "businessFrameStatus",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
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

        <Table
          rowKey="businessFrameId"
          columns={columns}
          dataSource={businessFrames}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
        />
      </Card>
    </>
  );
}
