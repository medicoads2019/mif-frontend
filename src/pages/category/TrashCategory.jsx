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
  getCategorysBySoftDelete,
  restoreCategory,
  hardDeleteCategory,
} from "../../api/categoryApi";

const { Title } = Typography;

export default function TrashCategory() {
  const [categorys, setCategorys] = useState([]);
  const [loading, setLoading] = useState(false);

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
    },
    {
      title: "Category Date",
      dataIndex: "categoryDate",
      key: "categoryDate",
    },
    {
      title: "Status",
      dataIndex: "categoryStatus",
      key: "categoryStatus",
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

        <Table
          rowKey="categoryId"
          columns={columns}
          dataSource={categorys}
          loading={loading}
        />
      </Card>
    </>
  );
}
