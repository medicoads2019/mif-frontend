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
  getClientFramesBySoftDelete,
  restoreClientFrame,
  hardDeleteClientFrame,
} from "../../api/clientFrameApi";

const { Title } = Typography;

export default function TrashClientFrame() {
  const [clientFrames, setClientFrames] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusColor = {
    APPROVED: "green",
    PENDING: "blue",
    REJECTED: "red",
    DELETED: "default",
  };

  /* =========================================
     LOAD TRASH CLIENT FRAMES
  ========================================= */
  const loadTrash = async () => {
    try {
      setLoading(true);

      const res = await getClientFramesBySoftDelete(true);

      setClientFrames(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash client frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  /* =========================================
     RESTORE CLIENT FRAME
  ========================================= */
  const handleRestore = async (clientFrameId) => {
    try {
      await restoreClientFrame(clientFrameId);

      message.success("Client frame restored successfully");

      setClientFrames((prev) =>
        prev.filter((cf) => cf.clientFrameId !== clientFrameId),
      );
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE CLIENT FRAME
  ========================================= */
  const handleHardDelete = async (clientFrameId) => {
    try {
      await hardDeleteClientFrame(clientFrameId);

      message.success("Client frame permanently deleted");

      setClientFrames((prev) =>
        prev.filter((cf) => cf.clientFrameId !== clientFrameId),
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
      title: "Client Frame Name",
      dataIndex: "clientFrameName",
    },
    {
      title: "Status",
      dataIndex: "clientFrameStatus",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Restore this client frame?"
            onConfirm={() => handleRestore(record.clientFrameId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this client frame? This cannot be undone."
            onConfirm={() => handleHardDelete(record.clientFrameId)}
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
          { title: "Client Frames" },
          { title: "Trash" },
        ]}
      />

      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Trash — Client Frames
        </Title>

        <Table
          rowKey="clientFrameId"
          columns={columns}
          dataSource={clientFrames}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
        />
      </Card>
    </>
  );
}
