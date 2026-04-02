import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Popconfirm,
  Tooltip,
  message,
  Switch,
  Image,
  Select,
  Breadcrumb,
  Typography,
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  HolderOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  getAllStartScreenImages,
  softDeleteStartScreenImage,
  updateShowInStartScreen,
  updateStartScreenImageStatus,
  reorderStartScreenImages,
} from "../../api/startScreenImageApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];
const { Title } = Typography;

/* ── Sortable row ── */
const SortableRow = (props) => {
  const { setNodeRef, transform, transition } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <tr ref={setNodeRef} style={style} {...props}>
      {props.children}
    </tr>
  );
};

/* ── Drag handle ── */
const DragHandle = ({ id }) => {
  const { attributes, listeners } = useSortable({ id });
  return (
    <HolderOutlined
      {...attributes}
      {...listeners}
      style={{ cursor: "grab", color: "#999", fontSize: 16 }}
    />
  );
};

export default function StartScreenImages() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await getAllStartScreenImages();
      if (data?.success) setImages(data.data || []);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load start screen images",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await softDeleteStartScreenImage(id);
      if (data?.success) {
        message.success(data.message || "Image deleted");
        setImages((prev) =>
          prev.filter((img) => img.startScreenImageId !== id),
        );
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleShowToggle = async (id, checked) => {
    try {
      const { data } = await updateShowInStartScreen(id, checked);
      if (data?.success) {
        message.success(
          checked ? "Enabled in start screen" : "Hidden from start screen",
        );
        setImages((prev) =>
          prev.map((img) =>
            img.startScreenImageId === id
              ? { ...img, showInStartScreen: checked }
              : img,
          ),
        );
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await updateStartScreenImageStatus(id, status);
      if (data?.success) {
        message.success(`Status updated to ${status}`);
        setImages((prev) =>
          prev.map((img) =>
            img.startScreenImageId === id ? { ...img, status } : img,
          ),
        );
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex(
      (img) => img.startScreenImageId === active.id,
    );
    const newIndex = images.findIndex(
      (img) => img.startScreenImageId === over.id,
    );
    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);
    try {
      await reorderStartScreenImages(
        reordered.map((img) => img.startScreenImageId),
      );
      message.success("Order saved");
    } catch {
      message.error("Failed to save order");
      fetchImages();
    }
  };

  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      width: 100,
      align: "center",
      render: (_, record, index) => (
        <Space>
          <DragHandle id={record.startScreenImageId} />
          {index + 1}
        </Space>
      ),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 100,
      align: "center",
      render: (url) =>
        url ? (
          <Image
            src={url}
            width={56}
            height={80}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span style={{ color: "#aaa" }}>No image</span>
        ),
    },
    {
      title: "Name",
      dataIndex: "imageName",
      key: "imageName",
      align: "left",
    },
    {
      title: "Show in Start Screen",
      dataIndex: "showInStartScreen",
      key: "showInStartScreen",
      width: 160,
      align: "center",
      render: (val, record) => (
        <Switch
          checked={val}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          onChange={(checked) =>
            handleShowToggle(record.startScreenImageId, checked)
          }
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center",
      render: (val, record) => (
        <Select
          value={val}
          size="small"
          style={{ width: 110 }}
          onChange={(status) =>
            handleStatusChange(record.startScreenImageId, status)
          }
          options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
          optionRender={(option) => {
            const status = option.value;
            const color = status === "ACTIVE" ? "green" : "default";
            return <Tag color={color}>{status}</Tag>;
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() =>
                navigate(`/start-screen-images/${record.startScreenImageId}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete this image?"
            onConfirm={() => handleDelete(record.startScreenImageId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteIcon />}
                style={{ fontSize: 18 }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredImages = images.filter((img) =>
    (img.imageName || "").toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[{ title: "Dashboard" }, { title: "Start Screen Images" }]}
      />

      <PageHeader
        title="Start Screen Images"
        extra={
          <Space>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search image name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchImages}>
              Refresh
            </Button>
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/start-screen-images/create")}
            >
              Add Image
            </Button>
          </Space>
        }
      />
      <Card>
        <Title level={4} style={{ marginTop: 0 }}>
          Start Screen Image List
        </Title>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredImages.map((img) => img.startScreenImageId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey="startScreenImageId"
              components={{ body: { row: SortableRow } }}
              onRow={(record) => ({
                "data-row-key": record.startScreenImageId,
              })}
              dataSource={filteredImages}
              columns={columns}
              loading={loading}
              pagination={{ pageSize }}
            />
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
}
