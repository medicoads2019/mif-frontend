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
  getAllBusinessFrames,
  searchBusinessFrameByName,
  softDeleteBusinessFrame,
  updateBusinessFrameStatus,
} from "../../api/businessFrameApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const STATUS_OPTIONS = ["APPROVED", "PENDING", "REJECTED"];

const BusinessFrames = () => {
  const navigate = useNavigate();

  const [businessFrames, setBusinessFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH ================= */
  const fetchBusinessFrames = async () => {
    try {
      setLoading(true);

      const { data } = await getAllBusinessFrames();

      if (data?.success) {
        setBusinessFrames(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load business frames",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchBusinessFrames();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchBusinessFrameByName(searchText);

      if (data?.success) {
        setBusinessFrames(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (businessFrameId) => {
    try {
      const { data } = await softDeleteBusinessFrame(businessFrameId);

      if (data?.success) {
        message.success(data.message || "Business frame deleted");

        setBusinessFrames((prev) =>
          prev.filter((bf) => bf.businessFrameId !== businessFrameId),
        );

        fetchBusinessFrames();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (businessFrameId, newStatus) => {
    try {
      await updateBusinessFrameStatus(businessFrameId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setBusinessFrames((prev) =>
        prev.map((bf) =>
          bf.businessFrameId === businessFrameId
            ? { ...bf, businessFrameStatus: newStatus }
            : bf,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    fetchBusinessFrames();
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
      title: "Business Frame Name",
      dataIndex: "businessFrameName",
      sorter: (a, b) => a.businessFrameName.localeCompare(b.businessFrameName),
    },
    {
      title: "Status",
      dataIndex: "businessFrameStatus",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.businessFrameId, val)}
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
      sorter: (a, b) =>
        a.businessFrameStatus.localeCompare(b.businessFrameStatus),
    },
    {
      title: "Images",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<PictureOutlined />}
          size="small"
          onClick={() => navigate(`/businessFrames/${record.businessFrameId}`)}
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
          <Tooltip title="Edit Business Frame">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() =>
                navigate(`/businessFrames/${record.businessFrameId}`)
              }
            />
          </Tooltip>

          <Popconfirm
            title="Delete Business Frame"
            description="Are you sure you want to delete this business frame?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.businessFrameId)}
          >
            <Tooltip title="Delete Business Frame">
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
        title="Business Frames"
        breadcrumb={["Dashboard", "Business Frames"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search business frame"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchBusinessFrames}>
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/businessFrames/create")}
            >
              Create Business Frame
            </Button>
          </Space>
        }
      />

      <Card>
        <Table
          columns={columns}
          dataSource={businessFrames}
          loading={loading}
          rowKey="businessFrameId"
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          scroll={{ x: 700 }}
        />
      </Card>
    </>
  );
};

export default BusinessFrames;
