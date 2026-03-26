import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Popconfirm,
  Tooltip,
  message,
  Avatar,
  Select,
} from "antd";

import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  getAllClients,
  getClientByMobile,
  getClientByEmail,
  softDeleteClient,
  updateClientStatus,
  updateClientUserType,
} from "../../api/clientApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH ================= */
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await getAllClients();
      if (data?.success) {
        setClients(data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchClients();
      return;
    }

    try {
      setLoading(true);
      // Try searching by mobile first; if it looks like email, search by email
      let res;
      if (searchText.includes("@")) {
        res = await getClientByEmail(searchText.trim());
        if (res?.data?.success) {
          setClients(res.data.data ? [res.data.data] : []);
        }
      } else {
        res = await getClientByMobile(searchText.trim());
        if (res?.data?.success) {
          setClients(res.data.data ? [res.data.data] : []);
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Client not found");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (clientId) => {
    try {
      const { data } = await softDeleteClient(clientId);
      if (data?.success) {
        message.success(data.message || "Client deleted");
        setClients((prev) => prev.filter((c) => c.clientId !== clientId));
        fetchClients();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= STATUS & USERTYPE CHANGE ================= */
  const handleStatusChange = async (clientId, newStatus) => {
    try {
      await updateClientStatus(clientId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setClients((prev) =>
        prev.map((c) =>
          c.clientId === clientId ? { ...c, clientStatus: newStatus } : c,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const handleUserTypeChange = async (clientId, newType) => {
    try {
      await updateClientUserType(clientId, newType);
      message.success(`User type updated to ${newType}`);
      setClients((prev) =>
        prev.map((c) =>
          c.clientId === clientId ? { ...c, userType: newType } : c,
        ),
      );
    } catch (error) {
      message.error(
        error?.response?.data?.message || "User type update failed",
      );
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ================= STATUS TAG ================= */
  const statusColor = {
    ACTIVE: "green",
    PENDING: "orange",
    BLOCKED: "red",
    SUSPENDED: "volcano",
  };

  const userTypeColor = {
    PREMIUM: "gold",
    DEMO: "blue",
    GUEST: "default",
  };

  const CLIENT_STATUS_OPTIONS = ["ACTIVE", "PENDING", "BLOCKED", "SUSPENDED"];
  const CLIENT_USERTYPE_OPTIONS = ["PREMIUM", "DEMO", "GUEST"];

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Photo",
      key: "photo",
      width: 70,
      render: (_, record) =>
        record.profilePhotoThumbnailUrl ? (
          <Avatar src={record.profilePhotoThumbnailUrl} size={40} />
        ) : (
          <Avatar icon={<UserOutlined />} size={40} />
        ),
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        [record.firstName, record.middleName, record.lastName]
          .filter(Boolean)
          .join(" "),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "User Type",
      dataIndex: "userType",
      render: (type, record) => (
        <Select
          value={type}
          size="small"
          style={{ minWidth: 90 }}
          onChange={(val) => handleUserTypeChange(record.clientId, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {CLIENT_USERTYPE_OPTIONS.map((t) => (
            <Select.Option key={t} value={t}>
              <Tag color={userTypeColor[t] || "default"} style={{ margin: 0 }}>
                {t}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      ),
      sorter: (a, b) => a.userType.localeCompare(b.userType),
    },
    {
      title: "Status",
      dataIndex: "clientStatus",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.clientId, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {CLIENT_STATUS_OPTIONS.map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={statusColor[s] || "default"} style={{ margin: 0 }}>
                {s}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      ),
      sorter: (a, b) => a.clientStatus.localeCompare(b.clientStatus),
    },
    {
      title: "Actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Client">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/clients/${record.clientId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Client"
            description="Are you sure you want to delete this client?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.clientId)}
          >
            <Tooltip title="Delete Client">
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
        title="Clients"
        breadcrumb={["Dashboard", "Clients"]}
        extra={
          <Space wrap>
            <Input
              placeholder="Search by mobile or email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
              style={{ width: 240 }}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button icon={<ReloadOutlined />} onClick={fetchClients}>
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/clients/create")}
            >
              Create Client
            </Button>
          </Space>
        }
      />

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="clientId"
        loading={loading}
        pagination={{ pageSize: 15, showSizeChanger: true }}
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default Clients;
