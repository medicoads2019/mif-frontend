import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
  message,
  Switch,
  Image,
  Select,
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  HolderOutlined,
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

/* ── Sortable row ── */
const SortableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props["data-row-key"] });
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
      title: "",
      key: "drag",
      width: 40,
      render: (_, record) => <DragHandle id={record.startScreenImageId} />,
    },
    {
      title: "Index",
      dataIndex: "indexValue",
      key: "indexValue",
      width: 70,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 100,
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
    },
    {
      title: "Show in Start Screen",
      dataIndex: "showInStartScreen",
      key: "showInStartScreen",
      width: 160,
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
      render: (val, record) => (
        <Select
          value={val}
          size="small"
          style={{ width: 110 }}
          onChange={(status) =>
            handleStatusChange(record.startScreenImageId, status)
          }
          options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditIcon />}
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
              <Button size="small" danger icon={<DeleteIcon />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Start Screen Images"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchImages} />
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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.startScreenImageId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey="startScreenImageId"
              components={{ body: { row: SortableRow } }}
              onRow={(record) => ({
                "data-row-key": record.startScreenImageId,
              })}
              dataSource={images}
              columns={columns}
              loading={loading}
              pagination={{ pageSize: 20 }}
            />
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
}
