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
  DatePicker,
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  PictureOutlined,
} from "@ant-design/icons";

import {
  getAllFestivals,
  searchFestivalByName,
  softDeleteFestival,
  updateFestivalStatus,
  updateFestivalName,
  updateFestivalDate,
} from "../../api/festivalApi";

import { formatIndianDate } from "../../utils/dateFormatter";
import dayjs from "dayjs";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STATUS_OPTIONS = ["APPROVED", "PENDING", "REJECTED"];

const Festivals = () => {
  const navigate = useNavigate();

  const [festivals, setFestivals] = useState([]);
  const [allFestivals, setAllFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [activeMonth, setActiveMonth] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  /* ================= FETCH FESTIVALS ================= */
  const fetchFestivals = async () => {
    try {
      setLoading(true);

      const { data } = await getAllFestivals();

      if (data?.success) {
        const all = data.data || [];
        setAllFestivals(all);
        applyMonthFilter(all, activeMonth);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load festivals",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= MONTH FILTER ================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const applyMonthFilter = (list, monthIndex) => {
    if (monthIndex === null) {
      setFestivals(list);
      return;
    }
    const filtered = list.filter((f) => {
      const d = new Date(f.festivalDate);
      // Only current or future dates allowed
      if (d < today) return false;
      return d.getMonth() === monthIndex;
    });
    setFestivals(filtered);
  };

  const handleMonthClick = (monthIndex) => {
    if (activeMonth === monthIndex) {
      setActiveMonth(null);
      applyMonthFilter(allFestivals, null);
    } else {
      setActiveMonth(monthIndex);
      applyMonthFilter(allFestivals, monthIndex);
    }
    setSearchText("");
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (festivalId, newStatus) => {
    try {
      await updateFestivalStatus(festivalId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === festivalId ? { ...f, festivalStatus: newStatus } : f,
        ),
      );
      setAllFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === festivalId ? { ...f, festivalStatus: newStatus } : f,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const startInlineEdit = (record, field) => {
    if (field === "festivalName") {
      setEditingCell({ festivalId: record.festivalId, field });
      setEditingValue(record.festivalName || "");
    }
  };

  const cancelInlineEdit = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const saveFestivalName = async (record) => {
    const nextName = editingValue.trim();
    if (!nextName) {
      message.warning("Festival name cannot be empty");
      return;
    }
    if (nextName === record.festivalName) {
      cancelInlineEdit();
      return;
    }

    try {
      await updateFestivalName(record.festivalId, nextName);
      message.success("Festival name updated");

      setFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === record.festivalId
            ? { ...f, festivalName: nextName }
            : f,
        ),
      );
      setAllFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === record.festivalId
            ? { ...f, festivalName: nextName }
            : f,
        ),
      );
      cancelInlineEdit();
    } catch (error) {
      message.error(error?.response?.data?.message || "Name update failed");
    }
  };

  const saveFestivalDate = async (record, dateValue) => {
    if (!dateValue) return;

    const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
    const currentDate = record.festivalDate
      ? dayjs(record.festivalDate).format("DD-MM-YYYY")
      : null;

    if (formattedDate === currentDate) return;

    try {
      await updateFestivalDate(record.festivalId, formattedDate);
      message.success("Festival date updated");

      setFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === record.festivalId
            ? { ...f, festivalDate: dayjs(dateValue).toISOString() }
            : f,
        ),
      );
      setAllFestivals((prev) =>
        prev.map((f) =>
          f.festivalId === record.festivalId
            ? { ...f, festivalDate: dayjs(dateValue).toISOString() }
            : f,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Date update failed");
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchFestivals();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchFestivalByName(searchText);

      if (data?.success) {
        const results = data.data || [];
        setAllFestivals(results);
        setActiveMonth(null);
        setFestivals(results);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (festivalId) => {
    try {
      const { data } = await softDeleteFestival(festivalId);

      if (data?.success) {
        message.success(data.message || "Festival deleted");

        setFestivals((prev) =>
          prev.filter((festival) => festival.festivalId !== festivalId),
        );
        setAllFestivals((prev) =>
          prev.filter((festival) => festival.festivalId !== festivalId),
        );

        fetchFestivals();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchFestivals();
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
      render: (_, __, index) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Festival Name",
      dataIndex: "festivalName",
      align: "left",
      render: (value, record) => {
        const isEditing =
          editingCell?.festivalId === record.festivalId &&
          editingCell?.field === "festivalName";

        if (isEditing) {
          return (
            <Input
              autoFocus
              size="small"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onPressEnter={() => saveFestivalName(record)}
              onBlur={() => saveFestivalName(record)}
              onClick={(e) => e.stopPropagation()}
            />
          );
        }

        return (
          <Tooltip title="Click to edit festival name">
            <span
              onClick={(e) => {
                e.stopPropagation();
                startInlineEdit(record, "festivalName");
              }}
              style={{ cursor: "pointer" }}
            >
              {value}
            </span>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.festivalName.localeCompare(b.festivalName),
    },
    {
      title: "Festival Date",
      dataIndex: "festivalDate",
      align: "center",
      sorter: (a, b) => new Date(a.festivalDate) - new Date(b.festivalDate),
      render: (date, record) => (
        <Tooltip title="Click to change festival date">
          <Space size={6} onClick={(e) => e.stopPropagation()}>
            <span>{formatIndianDate(date)}</span>
            <DatePicker
              size="small"
              value={date ? dayjs(date) : null}
              format="DD-MM-YYYY"
              allowClear={false}
              onChange={(val) => saveFestivalDate(record, val)}
            />
          </Space>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "festivalStatus",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.festivalId, val)}
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
      sorter: (a, b) => a.festivalStatus.localeCompare(b.festivalStatus),
    },
    {
      title: "Images",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<PictureOutlined />}
          size="small"
          onClick={() => navigate(`/festivals/${record.festivalId}`)}
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
          <Tooltip title="Edit Festival">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/festivals/${record.festivalId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Soft Delete Festival"
            description="Are you sure you want to delete this festival?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.festivalId)}
          >
            <Tooltip title="Delete Festival">
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
        title="Festivals"
        breadcrumb={["Dashboard", "Festivals"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search festival"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setActiveMonth(null);
                fetchFestivals();
              }}
            >
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
              onClick={() => navigate("/festivals/create")}
            >
              Create Festival
            </Button>
          </Space>
        }
      />

      <Card style={{ marginBottom: 12 }}>
        <Space wrap size={6}>
          <span style={{ fontWeight: 500, marginRight: 4 }}>
            Filter by Month:
          </span>
          {MONTHS.map((month, idx) => (
            <Button
              key={month}
              size="small"
              type={activeMonth === idx ? "primary" : "default"}
              onClick={() => handleMonthClick(idx)}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
          {activeMonth !== null && (
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => {
                setActiveMonth(null);
                applyMonthFilter(allFestivals, null);
              }}
            >
              Reset
            </Button>
          )}
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={festivals}
          loading={loading}
          rowKey="festivalId"
          pagination={{ pageSize }}
          bordered
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
    </>
  );
};

export default Festivals;
