import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Breadcrumb,
  Avatar,
  Select,
} from "antd";

import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getEmployeesBySoftDelete,
  restoreEmployee,
  hardDeleteEmployee,
} from "../../api/employeeApi";

const { Title } = Typography;

const statusColor = {
  ACTIVE: "green",
  PENDING: "orange",
  BLOCKED: "red",
  SUSPENDED: "volcano",
};

export default function TrashEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  /* =========================================
     LOAD TRASH EMPLOYEES
  ========================================= */
  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getEmployeesBySoftDelete(true);
      setEmployees(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load trash employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  /* =========================================
     RESTORE EMPLOYEE
  ========================================= */
  const handleRestore = async (employeeId) => {
    try {
      await restoreEmployee(employeeId);
      message.success("Employee restored successfully");
      setEmployees((prev) => prev.filter((e) => e.employeeId !== employeeId));
    } catch (err) {
      console.error(err);
      message.error("Restore failed");
    }
  };

  /* =========================================
     HARD DELETE EMPLOYEE
  ========================================= */
  const handleHardDelete = async (employeeId) => {
    try {
      await hardDeleteEmployee(employeeId);
      message.success("Employee permanently deleted");
      setEmployees((prev) => prev.filter((e) => e.employeeId !== employeeId));
    } catch (err) {
      console.error(err);
      message.error("Hard delete failed");
    }
  };

  /* =========================================
     TABLE COLUMNS
  ========================================= */
  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      render: (_, __, index) => index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Photo",
      key: "photo",
      width: 70,
      align: "center",
      render: (_, record) =>
        record.profilePhotoThumbnailUrl ? (
          <Avatar src={record.profilePhotoThumbnailUrl} size={36} />
        ) : (
          <Avatar icon={<UserOutlined />} size={36} />
        ),
    },
    {
      title: "Name",
      key: "name",
      align: "left",
      render: (_, record) =>
        [record.firstName, record.middleName, record.lastName]
          .filter(Boolean)
          .join(" "),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "userStatus",
      align: "center",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Restore Employee"
            description="Restore this employee to active?"
            onConfirm={() => handleRestore(record.employeeId)}
            okText="Restore"
            cancelText="Cancel"
          >
            <Button type="primary" size="small" ghost>
              Restore
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently Delete"
            description="This action cannot be undone!"
            onConfirm={() => handleHardDelete(record.employeeId)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button type="primary" danger size="small">
              Delete Permanently
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/employees">Employees</Link> },
          { title: "Trash" },
        ]}
      />

      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>
          Trash — Deleted Employees
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
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
        </div>

        <Table
          columns={columns}
          dataSource={employees}
          rowKey="employeeId"
          loading={loading}
          pagination={{ pageSize }}
          scroll={{ x: 800 }}
          locale={{ emptyText: "No deleted employees found" }}
        />
      </Card>
    </>
  );
}
