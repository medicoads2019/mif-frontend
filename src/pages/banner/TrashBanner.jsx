import { useEffect, useState } from "react";
import { Table, Button, Space, Card, Popconfirm, message, Select } from "antd";

import {
  getBannersBySoftDelete,
  restoreBanner,
  hardDeleteBanner,
} from "../../api/bannerApi";

export default function TrashBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

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
      align: "left",
    },
    {
      title: "Action",
      align: "center",
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
        rowKey="bannerId"
        columns={columns}
        dataSource={banners}
        loading={loading}
        pagination={{ pageSize }}
      />
    </Card>
  );
}
