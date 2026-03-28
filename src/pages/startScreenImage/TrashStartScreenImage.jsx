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
} from "antd";
import { Link } from "react-router-dom";

import {
  getStartScreenImagesBySoftDelete,
  restoreStartScreenImage,
  hardDeleteStartScreenImage,
} from "../../api/startScreenImageApi";

const { Text } = Typography;

export default function TrashStartScreenImage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
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
    },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Popconfirm
            title="Restore this image?"
            onConfirm={() => handleRestore(r.startScreenImageId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this image? This cannot be undone."
            onConfirm={() => handleHardDelete(r.startScreenImageId)}
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
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space>
        <Link to="/start-screen-images">
          <Button>← Back to List</Button>
        </Link>
      </Space>

      <Card title="Trash — Start Screen Images">
        <Table
          rowKey="startScreenImageId"
          columns={columns}
          dataSource={items}
          loading={loading}
        />
      </Card>
    </Space>
  );
}
