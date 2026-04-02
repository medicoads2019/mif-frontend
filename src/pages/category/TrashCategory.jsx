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
  getCategorysBySoftDelete,
  restoreCategory,
  hardDeleteCategory,
} from "../../api/categoryApi";

const { Title } = Typography;

export default function TrashCategory() {
  const [categorys, setCategorys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const statusColor = {
    APPROVED: "green",
    PENDING: "blue",
    REJECTED: "red",
    DELETED: "default",
  };

  /* =========================================
     LOAD TRASH CATEGORY
  ========================================= */
  const loadTrashCategorys = async () => {
    try {
      setLoading(true);

      const res = await getCategorysBySoftDelete(true);

      setCategorys(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash categorys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashCategorys();
  }, []);

  /* =========================================
     RESTORE CATEGORY
  ========================================= */
  const handleRestore = async (categoryId) => {
    try {
      await restoreCategory(categoryId);

      message.success("Category restored successfully");

      setCategorys((prev) => prev.filter((f) => f.categoryId !== categoryId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE CATEGORY
  ========================================= */
  const handleHardDelete = async (categoryId) => {
    try {
      await hardDeleteCategory(categoryId);

      message.success("Category permanently deleted");

      setCategorys((prev) => prev.filter((f) => f.categoryId !== categoryId));
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
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "left",
    },
    {
      title: "Category Date",
      dataIndex: "categoryDate",
      key: "categoryDate",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "categoryStatus",
      key: "categoryStatus",
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
            onClick={() => handleRestore(record.categoryId)}
          >
            Restore
          </Button>

          {/* Hard Delete */}
          <Popconfirm
            title="Permanently delete this category?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleHardDelete(record.categoryId)}
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
        items={[{ title: "Categorys" }, { title: "Trash" }]}
      />

      <Card>
        <Title level={4}>Trash Categorys 🗑</Title>

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
          rowKey="categoryId"
          columns={columns}
          dataSource={categorys}
          loading={loading}
          pagination={{ pageSize }}
        />
      </Card>
    </>
  );
}
