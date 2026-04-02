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
  getAllBusinesss,
  searchBusinessByName,
  softDeleteBusiness,
  updateBusinessStatus,
} from "../../api/businessApi";

import { formatIndianDate } from "../../utils/dateFormatter";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const STATUS_OPTIONS = ["APPROVED", "PENDING", "REJECTED"];

const Businesss = () => {
  const navigate = useNavigate();

  const [businesss, setBusinesss] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  /* ================= FETCH BUSINESS ================= */
  const fetchBusinesss = async () => {
    try {
      setLoading(true);

      const { data } = await getAllBusinesss();

      if (data?.success) {
        setBusinesss(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load businesss",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchBusinesss();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchBusinessByName(searchText);

      if (data?.success) {
        setBusinesss(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (businessId) => {
    try {
      const { data } = await softDeleteBusiness(businessId);

      if (data?.success) {
        message.success(data.message || "Business deleted");

        // instant UI update
        setBusinesss((prev) =>
          prev.filter((business) => business.businessId !== businessId),
        );

        // optional backend sync
        fetchBusinesss();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (businessId, newStatus) => {
    try {
      await updateBusinessStatus(businessId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setBusinesss((prev) =>
        prev.map((b) =>
          b.businessId === businessId ? { ...b, businessStatus: newStatus } : b,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    fetchBusinesss();
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
      title: "Business Name",
      dataIndex: "businessName",
      align: "left",
      sorter: (a, b) => a.businessName.localeCompare(b.businessName),
    },
    {
      title: "Status",
      dataIndex: "businessStatus",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.businessId, val)}
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
      sorter: (a, b) => a.businessStatus.localeCompare(b.businessStatus),
    },
    {
      title: "Images",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<PictureOutlined />}
          size="small"
          onClick={() => navigate(`/businesss/${record.businessId}`)}
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
          <Tooltip title="Edit Business">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/businesss/${record.businessId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Soft Delete Business"
            description="Are you sure you want to delete this business?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.businessId)}
          >
            <Tooltip title="Delete Business">
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
        title="Businesss"
        breadcrumb={["Dashboard", "Businesss"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search business"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchBusinesss}>
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
              onClick={() => navigate("/businesss/create")}
            >
              Create Business
            </Button>
          </Space>
        }
      />

      <Card>
        <Table
          columns={columns}
          dataSource={businesss}
          loading={loading}
          rowKey="businessId"
          pagination={{ pageSize }}
          bordered
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
    </>
  );
};

export default Businesss;
