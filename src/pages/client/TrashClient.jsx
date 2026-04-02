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
  const [pageSize, setPageSize] = useState(10);

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
      align: "center",
    },
    {
      title: "Name",
      key: "name",
      align: "left",
      render: (_, record) =>
        [record.firstName, record.middleName, record.lastName]
          .filter(Boolean)
          .join(" "),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "clientStatus",
      align: "center",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Frames",
      key: "frames",
      align: "center",
      render: (_, record) =>
        (record.businessFrameIds?.length || 0) +
        (record.clientFrameIds?.length || 0),
      sorter: (a, b) =>
        (a.businessFrameIds?.length || 0) +
        (a.clientFrameIds?.length || 0) -
        ((b.businessFrameIds?.length || 0) + (b.clientFrameIds?.length || 0)),
    },
    {
      title: "Download Count",
      dataIndex: "downloadCount",
      key: "downloadCount",
      align: "center",
      render: (count) => count ?? 0,
      sorter: (a, b) => (a.downloadCount ?? 0) - (b.downloadCount ?? 0),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
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
          columns={columns}
          dataSource={clients}
          rowKey="clientId"
          loading={loading}
          pagination={{ pageSize }}
          size="small"
          scroll={{ x: 800 }}
          locale={{ emptyText: "No deleted clients found" }}
        />
      </Card>
    </>
  );
}
