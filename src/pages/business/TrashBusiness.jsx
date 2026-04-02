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
  getBusinesssBySoftDelete,
  restoreBusiness,
  hardDeleteBusiness,
} from "../../api/businessApi";

const { Title } = Typography;

export default function TrashBusiness() {
  const [businesss, setBusinesss] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const statusColor = {
    APPROVED: "green",
    PENDING: "blue",
    REJECTED: "red",
    DELETED: "default",
  };

  /* =========================================
     LOAD TRASH BUSINESS
  ========================================= */
  const loadTrashBusinesss = async () => {
    try {
      setLoading(true);

      const res = await getBusinesssBySoftDelete(true);

      setBusinesss(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash businesss");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashBusinesss();
  }, []);

  /* =========================================
     RESTORE BUSINESS
  ========================================= */
  const handleRestore = async (businessId) => {
    try {
      await restoreBusiness(businessId);

      message.success("Business restored successfully");

      setBusinesss((prev) => prev.filter((f) => f.businessId !== businessId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE BUSINESS
  ========================================= */
  const handleHardDelete = async (businessId) => {
    try {
      await hardDeleteBusiness(businessId);

      message.success("Business permanently deleted");

      setBusinesss((prev) => prev.filter((f) => f.businessId !== businessId));
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
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      align: "left",
    },
    {
      title: "Business Date",
      dataIndex: "businessDate",
      key: "businessDate",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "businessStatus",
      key: "businessStatus",
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
            onClick={() => handleRestore(record.businessId)}
          >
            Restore
          </Button>

          {/* Hard Delete */}
          <Popconfirm
            title="Permanently delete this business?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleHardDelete(record.businessId)}
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
        items={[{ title: "Businesss" }, { title: "Trash" }]}
      />

      <Card>
        <Title level={4}>Trash Businesss 🗑</Title>

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
          rowKey="businessId"
          columns={columns}
          dataSource={businesss}
          loading={loading}
          pagination={{ pageSize }}
        />
      </Card>
    </>
  );
}
