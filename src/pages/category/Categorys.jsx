import { useEffect, useState } from "react";
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
  Select,
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  PictureOutlined,
  HolderOutlined,
} from "@ant-design/icons";

import {
  getAllCategorys,
  searchCategoryByName,
  softDeleteCategory,
  updateCategoryStatus,
  reorderCategorys,
} from "../../api/categoryApi";

import { formatIndianDate } from "../../utils/dateFormatter";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

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

/* ================= DRAG HANDLE ================= */
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

const Categorys = () => {
  const navigate = useNavigate();

  const [categorys, setCategorys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  /* ================= FETCH CATEGORY ================= */
  const fetchCategorys = async () => {
    try {
      setLoading(true);
      const { data } = await getAllCategorys();
      if (data?.success) {
        setCategorys(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load categorys",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchCategorys();
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchCategoryByName(searchText);
      if (data?.success) {
        setCategorys(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (categoryId) => {
    try {
      const { data } = await softDeleteCategory(categoryId);
      if (data?.success) {
        message.success(data.message || "Category deleted");
        setCategorys((prev) =>
          prev.filter((category) => category.categoryId !== categoryId),
        );
        fetchCategorys();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (categoryId, newStatus) => {
    try {
      await updateCategoryStatus(categoryId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setCategorys((prev) =>
        prev.map((c) =>
          c.categoryId === categoryId ? { ...c, categoryStatus: newStatus } : c,
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

    const oldIndex = categorys.findIndex((c) => c.categoryId === active.id);
    const newIndex = categorys.findIndex((c) => c.categoryId === over.id);
    const newOrder = arrayMove(categorys, oldIndex, newIndex);
    setCategorys(newOrder);

    try {
      const payload = newOrder.map((category, index) => ({
        categoryId: category.categoryId,
        orderIndex: index,
      }));
      await reorderCategorys(payload);
      await fetchCategorys();
      message.success("Category order updated");
    } catch {
      message.error("Reorder failed");
    }
  };

  useEffect(() => {
    fetchCategorys();
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
          <DragHandle id={record.categoryId} />
          {index + 1}
        </Space>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      align: "left",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: "Status",
      dataIndex: "categoryStatus",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.categoryId, val)}
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
      sorter: (a, b) => a.categoryStatus.localeCompare(b.categoryStatus),
    },
    {
      title: "Images",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<PictureOutlined />}
          size="small"
          onClick={() => navigate(`/categorys/${record.categoryId}`)}
        >
          {record.imageIds?.length || 0}
        </Button>
      ),
    },
    {
      title: "Actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Category">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/categorys/${record.categoryId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Soft Delete Category"
            description="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.categoryId)}
          >
            <Tooltip title="Delete Category">
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
        title="Categorys"
        breadcrumb={["Dashboard", "Categorys"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search category"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchCategorys}>
              Refresh
            </Button>

            <Select
              value={pageSize}
              onChange={setPageSize}
              style={{ minWidth: 100 }}
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
              onClick={() => navigate("/categorys/create")}
            >
              Create Category
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
            items={categorys.map((c) => c.categoryId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              columns={columns}
              dataSource={categorys}
              loading={loading}
              rowKey="categoryId"
              pagination={{ pageSize: pageSize }}
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
    </>
  );
};

export default Categorys;
