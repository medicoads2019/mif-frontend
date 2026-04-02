import { useEffect, useState } from "react";
import { Table, Button, Space, Card, Popconfirm, message, Select } from "antd";

import {
  getDemoFramesBySoftDelete,
  restoreDemoFrame,
  hardDeleteDemoFrame,
} from "../../api/demoFrameApi";

export default function TrashDemoFrame() {
  const [demoFrames, setDemoFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getDemoFramesBySoftDelete(true);
      setDemoFrames(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash demo frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (demoFrameId) => {
    try {
      await restoreDemoFrame(demoFrameId);
      message.success("DemoFrame restored successfully");
      setDemoFrames((prev) =>
        prev.filter((d) => d.demoFrameId !== demoFrameId),
      );
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  const handleHardDelete = async (demoFrameId) => {
    try {
      await hardDeleteDemoFrame(demoFrameId);
      message.success("DemoFrame permanently deleted");
      setDemoFrames((prev) =>
        prev.filter((d) => d.demoFrameId !== demoFrameId),
      );
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "DemoFrame Name",
      dataIndex: "demoFrameName",
      align: "left",
    },
    {
      title: "Action",
      align: "center",
      render: (_, r) => (
        <Space>
          <Popconfirm
            title="Restore this demo frame?"
            onConfirm={() => handleRestore(r.demoFrameId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary">Restore</Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this demo frame? This cannot be undone."
            onConfirm={() => handleHardDelete(r.demoFrameId)}
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
    <Card title="Trash DemoFrames">
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
        rowKey="demoFrameId"
        columns={columns}
        dataSource={demoFrames}
        loading={loading}
        pagination={{ pageSize }}
      />
    </Card>
  );
}
