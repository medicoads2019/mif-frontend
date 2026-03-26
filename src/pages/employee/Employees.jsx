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
  getAllEmployees,
  getEmployeeByMobile,
  getEmployeeByEmail,
  softDeleteEmployee,
  updateEmployeeStatus,
  updateEmployeeUserType,
} from "../../api/employeeApi";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";

const statusColor = {
  ACTIVE: "green",
  PENDING: "orange",
  BLOCKED: "red",
  SUSPENDED: "volcano",
};

const userTypeColor = {
  SUPER_ADMIN: "red",
  ADMIN: "volcano",
  SUPER_HR: "purple",
  HR: "geekblue",
  MARKETING: "cyan",
  MODERATOR: "blue",
  USER: "default",
};

const EMPLOYEE_STATUS_OPTIONS = ["ACTIVE", "PENDING", "BLOCKED", "SUSPENDED"];
const EMPLOYEE_USERTYPE_OPTIONS = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPER_HR",
  "HR",
  "MARKETING",
  "MODERATOR",
  "USER",
];

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH ================= */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await getAllEmployees();
      if (data?.success) {
        setEmployees(data.data || []);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load employees",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchEmployees();
      return;
    }

    try {
      setLoading(true);
      let res;
      if (searchText.includes("@")) {
        res = await getEmployeeByEmail(searchText.trim());
        if (res?.data?.success) {
          setEmployees(res.data.data ? [res.data.data] : []);
        }
      } else {
        res = await getEmployeeByMobile(searchText.trim());
        if (res?.data?.success) {
          setEmployees(res.data.data ? [res.data.data] : []);
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Employee not found");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS & USERTYPE CHANGE ================= */
  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await updateEmployeeStatus(employeeId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      setEmployees((prev) =>
        prev.map((e) =>
          e.employeeId === employeeId ? { ...e, userStatus: newStatus } : e,
        ),
      );
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const handleUserTypeChange = async (employeeId, newType) => {
    try {
      await updateEmployeeUserType(employeeId, newType);
      message.success(`User type updated to ${newType}`);
      setEmployees((prev) =>
        prev.map((e) =>
          e.employeeId === employeeId ? { ...e, userType: newType } : e,
        ),
      );
    } catch (error) {
      message.error(
        error?.response?.data?.message || "User type update failed",
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (employeeId) => {
    try {
      const { data } = await softDeleteEmployee(employeeId);
      if (data?.success) {
        message.success(data.message || "Employee deleted");
        fetchEmployees();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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
          style={{ minWidth: 130 }}
          onChange={(val) => handleUserTypeChange(record.employeeId, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {EMPLOYEE_USERTYPE_OPTIONS.map((t) => (
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
      dataIndex: "userStatus",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ minWidth: 110 }}
          onChange={(val) => handleStatusChange(record.employeeId, val)}
          onClick={(e) => e.stopPropagation()}
        >
          {EMPLOYEE_STATUS_OPTIONS.map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={statusColor[s] || "default"} style={{ margin: 0 }}>
                {s}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      ),
      sorter: (a, b) => a.userStatus.localeCompare(b.userStatus),
    },
    {
      title: "Actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Employee">
            <Button
              type="text"
              icon={<EditIcon />}
              style={{ fontSize: 18 }}
              onClick={() => navigate(`/employees/${record.employeeId}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.employeeId)}
          >
            <Tooltip title="Delete Employee">
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
        title="Employees"
        breadcrumb={["Dashboard", "Employees"]}
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

            <Button icon={<ReloadOutlined />} onClick={fetchEmployees}>
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/employees/create")}
            >
              Create Employee
            </Button>
          </Space>
        }
      />

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="employeeId"
        loading={loading}
        pagination={{ pageSize: 15, showSizeChanger: true }}
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default Employees;
