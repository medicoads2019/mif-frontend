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
  getAllBanners,
  searchBannerByName,
  softDeleteBanner,
  updateBannerCarousel,
  updateBannerStatus,
  reorderBanners,
} from "../../api/bannerApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import BannerPreview from "../../components/banner/BannerPreview";

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

export default function Banners() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  /* ================= FETCH BANNERS ================= */

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const { data } = await getAllBanners();

      if (data?.success) {
        setBanners(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchBanners();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchBannerByName(searchText);

      if (data?.success) {
        setBanners(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (bannerId) => {
    try {
      const { data } = await softDeleteBanner(bannerId);

      if (data?.success) {
        message.success(data.message || "Banner deleted");

        setBanners((prev) => prev.filter((b) => b.bannerId !== bannerId));

        fetchBanners();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= CAROUSEL TOGGLE ================= */

  const handleCarouselToggle = async (bannerId, value) => {
    try {
      await updateBannerCarousel(bannerId, value);

      message.success("Carousel updated");

      setBanners((prev) =>
        prev.map((b) =>
          b.bannerId === bannerId ? { ...b, showInCarousel: value } : b,
        ),
      );
    } catch (error) {
      message.error("Failed to update carousel");
    }
  };

  /* ================= STATUS CHANGE ================= */

  const handleStatusChange = async (bannerId, newStatus) => {
    try {
      await updateBannerStatus(bannerId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setBanners((prev) =>
        prev.map((b) =>
          b.bannerId === bannerId ? { ...b, bannerStatus: newStatus } : b,
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

    const oldIndex = banners.findIndex((b) => b.bannerId === active.id);

    const newIndex = banners.findIndex((b) => b.bannerId === over.id);

    const newOrder = arrayMove(banners, oldIndex, newIndex);

    setBanners(newOrder);

    try {
      const payload = newOrder.map((banner, index) => ({
        bannerId: banner.bannerId,
        orderIndex: index,
      }));

      await reorderBanners(payload);
      await fetchBanners();

      message.success("Banner order updated");
    } catch {
      message.error("Reorder failed");
    }
  };

  useEffect(() => {
    fetchBanners();
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
      align: "center",
      render: (_, record, index) => (
        <Space>
          <DragHandle id={record.bannerId} />
          {index + 1}
        </Space>
      ),
    },

    {
      title: "Banner",
      dataIndex: "thumbnailUrl",
      width: 140,
      align: "center",
      render: (url) => (
        <Image
          src={url}
          width={120}
          height={60}
          style={{
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },

    {
      title: "Banner Name",
      dataIndex: "bannerName",
      align: "left",
      sorter: (a, b) => a.bannerName.localeCompare(b.bannerName),
    },

    {
      title: "Status",
      dataIndex: "bannerStatus",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.bannerId, val)}
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
      sorter: (a, b) => a.bannerStatus.localeCompare(b.bannerStatus),
    },

    {
      title: "Carousel",
      dataIndex: "showInCarousel",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.showInCarousel}
          onChange={(value) => handleCarouselToggle(record.bannerId, value)}
        />
      ),
    },

    {
      title: "Actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Banner">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/banners/${record.bannerId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Soft Delete Banner"
            description="Are you sure you want to delete this banner?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.bannerId)}
          >
            <Tooltip title="Delete Banner">
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
        title="Banners"
        breadcrumb={["Dashboard", "Banners"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search banner"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchBanners}>
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
              onClick={() => navigate("/banners/create")}
            >
              Create Banner
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
            items={banners.map((b) => b.bannerId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              columns={columns}
              dataSource={banners}
              loading={loading}
              rowKey="bannerId"
              pagination={{ pageSize }}
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
        <BannerPreview banners={banners} />
      </Card>
    </>
  );
}
