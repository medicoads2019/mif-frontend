import React from "react";
import { Table, Image, Tag, Space, Button, Switch, Popconfirm } from "antd";
import {
  DeleteOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

/**
 * =========================================================
 * ⭐ BannerTable
 * =========================================================
 */
const BannerTable = ({
  banners = [],
  loading = false,
  lifecycle = "active",
  onPublish,
  onCarousel,
  onSoftDelete,
  onRestore,
  onStatus,
}) => {
  /**
   * ⭐ Columns
   */
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      key: "thumbnail",
      width: 120,
      render: (url) =>
        url ? <Image src={url} width={90} style={{ borderRadius: 6 }} /> : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        const color =
          status === "APPROVED"
            ? "green"
            : status === "REJECTED"
              ? "red"
              : "orange";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Published",
      dataIndex: "publishedAt",
      key: "published",
      width: 120,
      render: (v) => (v ? <Tag color="green">YES</Tag> : <Tag>NO</Tag>),
    },
    {
      title: "Carousel",
      key: "carousel",
      width: 120,
      render: (_, record) => (
        <Switch
          checked={record.showInCarousel}
          disabled={record.status !== "APPROVED" || lifecycle === "deleted"}
          onChange={(v) => onCarousel?.(record.id, v)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      render: (_, record) => (
        <Space>
          {/* ACTIVE */}
          {lifecycle === "active" && (
            <>
              {record.status === "PENDING" && (
                <Button
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onStatus?.(record.id, "APPROVED")}
                >
                  Approve
                </Button>
              )}

              {!record.publishedAt && record.status === "APPROVED" && (
                <Button size="small" onClick={() => onPublish?.(record.id)}>
                  Publish
                </Button>
              )}

              <Popconfirm
                title="Delete banner?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => onSoftDelete?.(record.id)}
              >
                <Button danger size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}

          {/* DELETED */}
          {lifecycle === "deleted" && (
            <Button
              size="small"
              icon={<RollbackOutlined />}
              onClick={() => onRestore?.(record.id)}
            >
              Restore
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={banners}
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 700 }}
    />
  );
};

export default BannerTable;
