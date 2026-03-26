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
} from "@ant-design/icons";

import {
  getAllFestivals,
  searchFestivalByName,
  softDeleteFestival,
  updateFestivalStatus,
} from "../../api/festivalApi";

import { formatIndianDate } from "../../utils/dateFormatter";

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
  const [activeMonth, setActiveMonth] = useState(null);

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
    },
    {
      title: "Festival Name",
      dataIndex: "festivalName",
      sorter: (a, b) => a.festivalName.localeCompare(b.festivalName),
    },
    {
      title: "Festival Date",
      dataIndex: "festivalDate",
      sorter: (a, b) => new Date(a.festivalDate) - new Date(b.festivalDate),
      render: (date) => formatIndianDate(date),
    },
    {
      title: "Status",
      dataIndex: "festivalStatus",
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
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
    </>
  );
};

export default Festivals;
