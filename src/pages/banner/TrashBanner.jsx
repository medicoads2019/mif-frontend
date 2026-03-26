import { useEffect, useState } from "react";
import { Table, Button, Space, Card, Popconfirm, message } from "antd";

import {
  getBannersBySoftDelete,
  restoreBanner,
  hardDeleteBanner,
} from "../../api/bannerApi";

export default function TrashBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getBannersBySoftDelete(true);
      setBanners(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (bannerId) => {
    try {
      await restoreBanner(bannerId);
      message.success("Banner restored successfully");
      setBanners((prev) => prev.filter((b) => b.bannerId !== bannerId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  const handleHardDelete = async (bannerId) => {
    try {
      await hardDeleteBanner(bannerId);
      message.success("Banner permanently deleted");
      setBanners((prev) => prev.filter((b) => b.bannerId !== bannerId));
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "Banner Name",
      dataIndex: "bannerName",
    },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Popconfirm
            title="Restore this banner?"
            onConfirm={() => handleRestore(r.bannerId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this banner? This cannot be undone."
            onConfirm={() => handleHardDelete(r.bannerId)}
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
    <Card title="Trash Banners">
      <Table
        rowKey="bannerId"
        columns={columns}
        dataSource={banners}
        loading={loading}
      />
    </Card>
  );
}
