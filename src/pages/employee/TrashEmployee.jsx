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
    },
    {
      title: "Photo",
      key: "photo",
      width: 70,
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
      render: (_, record) =>
        [record.firstName, record.middleName, record.lastName]
          .filter(Boolean)
          .join(" "),
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
      title: "Status",
      dataIndex: "userStatus",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
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

        <Table
          columns={columns}
          dataSource={employees}
          rowKey="employeeId"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          scroll={{ x: 800 }}
          locale={{ emptyText: "No deleted employees found" }}
        />
      </Card>
    </>
  );
}
