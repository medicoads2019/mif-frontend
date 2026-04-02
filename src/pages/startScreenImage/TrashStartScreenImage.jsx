import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Popconfirm,
  message,
  Image,
  Typography,
  Select,
  Breadcrumb,
  Tag,
} from "antd";

import {
  getStartScreenImagesBySoftDelete,
  restoreStartScreenImage,
  hardDeleteStartScreenImage,
} from "../../api/startScreenImageApi";

const { Text, Title } = Typography;

export default function TrashStartScreenImage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getStartScreenImagesBySoftDelete(true);
      setItems(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (itemId) => {
    try {
      await restoreStartScreenImage(itemId);
      message.success("Restored successfully");
      setItems((prev) => prev.filter((i) => i.startScreenImageId !== itemId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  const handleHardDelete = async (itemId) => {
    try {
      await hardDeleteStartScreenImage(itemId);
      message.success("Permanently deleted");
      setItems((prev) => prev.filter((i) => i.startScreenImageId !== itemId));
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      align: "center",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      align: "center",
      render: (url) =>
        url ? (
          <Image
            src={url}
            width={40}
            height={56}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Image Name",
      dataIndex: "imageName",
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 130,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {status || "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Show In Start",
      dataIndex: "showInStartScreen",
      align: "center",
      width: 150,
      render: (show) => (
        <Tag color={show ? "blue" : "default"}>{show ? "YES" : "NO"}</Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      align: "center",
      width: 140,
      render: (createdBy) => createdBy || "-",
    },
    {
      title: "Action",
      align: "center",
      render: (_, r) => (
        <Space>
          <Popconfirm
            title="Restore this image?"
            description="This image will return to active list."
            onConfirm={() => handleRestore(r.startScreenImageId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this image?"
            description="This action cannot be undone."
            onConfirm={() => handleHardDelete(r.startScreenImageId)}
            okText="Yes"
            cancelText="No"
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
        items={[{ title: "Start Screen Images" }, { title: "Trash" }]}
      />

      <Card>
        <Title level={4}>Trash Start Screen Images</Title>

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
          rowKey="startScreenImageId"
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize }}
        />
      </Card>
    </>
  );
}
