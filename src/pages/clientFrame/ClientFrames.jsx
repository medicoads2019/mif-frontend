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
  getAllClientFrames,
  searchClientFrameByName,
  softDeleteClientFrame,
  updateClientFrameStatus,
} from "../../api/clientFrameApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const STATUS_OPTIONS = ["APPROVED", "PENDING", "REJECTED"];

const ClientFrames = () => {
  const navigate = useNavigate();

  const [clientFrames, setClientFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  /* ================= FETCH ================= */
  const fetchClientFrames = async () => {
    try {
      setLoading(true);

      const { data } = await getAllClientFrames();

      if (data?.success) {
        setClientFrames(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load client frames",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchClientFrames();
      return;
    }

    try {
      setLoading(true);

      const { data } = await searchClientFrameByName(searchText);

      if (data?.success) {
        setClientFrames(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (clientFrameId) => {
    try {
      const { data } = await softDeleteClientFrame(clientFrameId);

      if (data?.success) {
        message.success(data.message || "Client frame deleted");

        setClientFrames((prev) =>
          prev.filter((cf) => cf.clientFrameId !== clientFrameId),
        );

        fetchClientFrames();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (clientFrameId, newStatus) => {
    try {
      await updateClientFrameStatus(clientFrameId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setClientFrames((prev) =>
        prev.map((cf) =>
          cf.clientFrameId === clientFrameId
            ? { ...cf, clientFrameStatus: newStatus }
            : cf,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    fetchClientFrames();
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
      title: "Client Frame Name",
      dataIndex: "clientFrameName",
      align: "left",
      sorter: (a, b) => a.clientFrameName.localeCompare(b.clientFrameName),
    },
    {
      title: "Client Frame Code",
      dataIndex: "clientFrameCode",
      key: "clientFrameCode",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "clientFrameStatus",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.clientFrameId, val)}
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
      sorter: (a, b) => a.clientFrameStatus.localeCompare(b.clientFrameStatus),
    },
    {
      title: "Images",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          icon={<PictureOutlined />}
          size="small"
          onClick={() => navigate(`/clientFrames/${record.clientFrameId}`)}
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
          <Tooltip title="Edit Client Frame">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/clientFrames/${record.clientFrameId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Client Frame"
            description="Are you sure you want to delete this client frame?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.clientFrameId)}
          >
            <Tooltip title="Delete Client Frame">
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
        title="Client Frames"
        breadcrumb={["Dashboard", "Client Frames"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search client frame"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchClientFrames}>
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
              onClick={() => navigate("/clientFrames/create")}
            >
              Create Client Frame
            </Button>
          </Space>
        }
      />

      <Card>
        <Table
          columns={columns}
          dataSource={clientFrames}
          loading={loading}
          rowKey="clientFrameId"
          pagination={{ pageSize }}
          bordered
          size="small"
          scroll={{ x: 700 }}
        />
      </Card>
    </>
  );
};

export default ClientFrames;
