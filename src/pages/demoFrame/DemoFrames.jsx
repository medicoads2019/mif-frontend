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
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  HolderOutlined,
} from "@ant-design/icons";

import {
  getAllDemoFrames,
  searchDemoFrameByName,
  softDeleteDemoFrame,
  updateDemoFrameCarousel,
  updateDemoFrameStatus,
  reorderDemoFrames,
} from "../../api/demoFrameApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import DemoFramePreview from "../../components/demoFrame/DemoFramePreview";

/* ================= DND IMPORTS ================= */

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const STATUS_OPTIONS = ["APPROVED", "PENDING", "REJECTED"];

/* ================= SORTABLE ROW ================= */

const SortableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
/* ================= DRAG HANDLE ================= */

const DragHandle = ({ id }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <HolderOutlined
      {...attributes}
      {...listeners}
      style={{
        cursor: "grab",
        color: "#999",
        fontSize: 16,
      }}
    />
  );
};

export default function DemoFrames() {
  const navigate = useNavigate();

  const [demoFrames, setDemoFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH DEMOFRAMES ================= */

  const fetchDemoFrames = async () => {
    try {
      setLoading(true);

      const { data } = await getAllDemoFrames();

      if (data?.success) {
        setDemoFrames(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load demoFrames",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchDemoFrames();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchDemoFrameByName(searchText);

      if (data?.success) {
        setDemoFrames(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (demoFrameId) => {
    try {
      const { data } = await softDeleteDemoFrame(demoFrameId);

      if (data?.success) {
        message.success(data.message || "DemoFrame deleted");

        setDemoFrames((prev) =>
          prev.filter((b) => b.demoFrameId !== demoFrameId),
        );

        fetchDemoFrames();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= CAROUSEL TOGGLE ================= */

  const handleCarouselToggle = async (demoFrameId, value) => {
    try {
      await updateDemoFrameCarousel(demoFrameId, value);

      message.success("Carousel updated");

      setDemoFrames((prev) =>
        prev.map((b) =>
          b.demoFrameId === demoFrameId ? { ...b, showInCarousel: value } : b,
        ),
      );
    } catch (error) {
      message.error("Failed to update carousel");
    }
  };

  /* ================= STATUS CHANGE ================= */

  const handleStatusChange = async (demoFrameId, newStatus) => {
    try {
      await updateDemoFrameStatus(demoFrameId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setDemoFrames((prev) =>
        prev.map((b) =>
          b.demoFrameId === demoFrameId
            ? { ...b, demoFrameStatus: newStatus }
            : b,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  /* ================= DRAG REORDER ================= */

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = demoFrames.findIndex((b) => b.demoFrameId === active.id);

    const newIndex = demoFrames.findIndex((b) => b.demoFrameId === over.id);

    const newOrder = arrayMove(demoFrames, oldIndex, newIndex);

    setDemoFrames(newOrder);

    try {
      const payload = newOrder.map((demoFrame, index) => ({
        demoFrameId: demoFrame.demoFrameId,
        orderIndex: index,
      }));

      await reorderDemoFrames(payload);
      await fetchDemoFrames();

      message.success("DemoFrame order updated");
    } catch {
      message.error("Reorder failed");
    }
  };

  useEffect(() => {
    fetchDemoFrames();
  }, []);

  /* ================= STATUS TAG ================= */

  const statusColor = {
    APPROVED: "green",
    PENDING: "orange",
    REJECTED: "red",
    DELETED: "volcano",
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      width: 90,
      render: (_, record, index) => (
        <Space>
          <DragHandle id={record.demoFrameId} />
          {index + 1}
        </Space>
      ),
    },

    {
      title: "DemoFrame",
      dataIndex: "thumbnailUrl",
      width: 120,
      render: (url) => (
        <Image
          src={url}
          width={80}
          height={80}
          // preview={false}
          style={{
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
      ),
    },

    {
      title: "DemoFrame Name",
      dataIndex: "demoFrameName",
      sorter: (a, b) => a.demoFrameName.localeCompare(b.demoFrameName),
    },

    {
      title: "Status",
      dataIndex: "demoFrameStatus",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.demoFrameId, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={statusColor[s] || "default"} style={{ margin: 0 }}>
                {s}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      ),
      sorter: (a, b) => a.demoFrameStatus.localeCompare(b.demoFrameStatus),
    },

    {
      title: "Carousel",
      dataIndex: "showInCarousel",
      width: 120,
      render: (_, record) => (
        <Switch
          checked={record.showInCarousel}
          onChange={(value) => handleCarouselToggle(record.demoFrameId, value)}
        />
      ),
    },

    {
      title: "Actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit DemoFrame">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/demoFrames/${record.demoFrameId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Soft Delete DemoFrame"
            description="Are you sure you want to delete this demoFrame?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.demoFrameId)}
          >
            <Tooltip title="Delete DemoFrame">
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

  return (
    <>
      <PageHeader
        title="DemoFrames"
        breadcrumb={["Dashboard", "DemoFrames"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search demoFrame"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchDemoFrames}>
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/demoFrames/create")}
            >
              Create DemoFrame
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
            items={demoFrames.map((b) => b.demoFrameId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              columns={columns}
              dataSource={demoFrames}
              loading={loading}
              rowKey="demoFrameId"
              pagination={{ pageSize: 10 }}
              bordered
              size="small"
              scroll={{ x: 800 }}
              components={{
                body: {
                  row: SortableRow,
                },
              }}
            />
          </SortableContext>
        </DndContext>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <DemoFramePreview demoFrames={demoFrames} />
      </Card>
    </>
  );
}
