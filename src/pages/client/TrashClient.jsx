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
  Avatar,
} from "antd";

import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getClientsBySoftDelete,
  restoreClient,
  hardDeleteClient,
} from "../../api/clientApi";

const { Title } = Typography;

const statusColor = {
  ACTIVE: "green",
  PENDING: "orange",
  BLOCKED: "red",
  SUSPENDED: "volcano",
};

export default function TrashClient() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================================
     LOAD TRASH CLIENTS
  ========================================= */
  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getClientsBySoftDelete(true);
      setClients(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  /* =========================================
     RESTORE CLIENT
  ========================================= */
  const handleRestore = async (clientId) => {
    try {
      await restoreClient(clientId);
      message.success("Client restored successfully");
      setClients((prev) => prev.filter((c) => c.clientId !== clientId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE CLIENT
  ========================================= */
  const handleHardDelete = async (clientId) => {
    try {
      await hardDeleteClient(clientId);
      message.success("Client permanently deleted");
      setClients((prev) => prev.filter((c) => c.clientId !== clientId));
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
      title: "Sr. No.",
      key: "srNo",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Photo",
      key: "photo",
      width: 70,
      render: (_, record) =>
        record.profilePhotoThumbnailUrl ? (
          <Avatar src={record.profilePhotoThumbnailUrl} size={36} />
        ) : (
          <Avatar icon={<UserOutlined />} size={36} />
        ),
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        [record.firstName, record.middleName, record.lastName]
          .filter(Boolean)
          .join(" "),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "clientStatus",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Restore Client"
            description="Restore this client to active?"
            onConfirm={() => handleRestore(record.clientId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary" size="small" ghost>
              Restore
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently Delete"
            description="This action cannot be undone!"
            onConfirm={() => handleHardDelete(record.clientId)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button type="primary" danger size="small">
              Delete Permanently
            </Button>
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
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/clients">Clients</Link> },
          { title: "Trash" },
        ]}
      />

      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Trash — Deleted Clients
        </Title>

        <Table
          columns={columns}
          dataSource={clients}
          rowKey="clientId"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          scroll={{ x: 800 }}
          locale={{ emptyText: "No deleted clients found" }}
        />
      </Card>
    </>
  );
}
