import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Image,
  Avatar,
  Tag,
  Space,
  Row,
  Col,
  Breadcrumb,
  Descriptions,
  Divider,
  Popconfirm,
  Spin,
  Typography,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { message } from "antd";

import {
  getEmployeeById,
  updateEmployeePersonalInfo,
  updateEmployeeProfilePhoto,
  updateEmployeePassword,
  updateEmployeeStatus,
  updateEmployeeUserType,
  verifyEmployeeMobileOtp,
  verifyEmployeeEmailOtp,
} from "../../api/employeeApi";

const { Title, Text } = Typography;
const { Option } = Select;

const VALID_STATUSES = ["PENDING", "ACTIVE", "BLOCKED", "SUSPENDED"];
const VALID_USER_TYPES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPER_HR",
  "HR",
  "MARKETING",
  "MODERATOR",
  "USER",
];

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

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [personalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingUserType, setUpdatingUserType] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  /* =========================================
     LOAD EMPLOYEE
  ========================================= */
  const loadEmployee = async () => {
    try {
      setLoading(true);
      const { data } = await getEmployeeById(id);
      if (!data?.success) {
        setEmployee(null);
        return;
      }
      setEmployee(data.data);

      personalForm.setFieldsValue({
        firstName: data.data.firstName,
        middleName: data.data.middleName,
        lastName: data.data.lastName,
        dateOfBirth: data.data.dateOfBirth
          ? data.data.dateOfBirth.slice(0, 10)
          : undefined,
        gender: data.data.gender,
        alternateMobileNumber: data.data.alternateMobileNumber,
      });
    } catch (error) {
      message.error("Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  /* =========================================
     UPDATE PERSONAL INFO
  ========================================= */
  const onSavePersonal = async (values) => {
    try {
      setSavingPersonal(true);
      const payload = {
        firstName: values.firstName,
        middleName: values.middleName || null,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        alternateMobileNumber: values.alternateMobileNumber || null,
      };
      await updateEmployeePersonalInfo(id, payload);
      message.success("Personal info updated");
      loadEmployee();
    } catch (error) {
      message.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSavingPersonal(false);
    }
  };

  /* =========================================
     UPDATE PASSWORD
  ========================================= */
  const onSavePassword = async (values) => {
    try {
      setSavingPassword(true);
      await updateEmployeePassword(id, values.password);
      message.success("Password updated");
      passwordForm.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  /* =========================================
     UPDATE STATUS
  ========================================= */
  const handleStatusChange = async (status) => {
    try {
      setUpdatingStatus(true);
      await updateEmployeeStatus(id, status);
      message.success(`Status updated to ${status}`);
      loadEmployee();
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================
     UPDATE USER TYPE
  ========================================= */
  const handleUserTypeChange = async (userType) => {
    try {
      setUpdatingUserType(true);
      await updateEmployeeUserType(id, userType);
      message.success(`User type updated to ${userType}`);
      loadEmployee();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "User type update failed",
      );
    } finally {
      setUpdatingUserType(false);
    }
  };

  /* =========================================
     PROFILE PHOTO UPLOAD
  ========================================= */
  const beforePhotoUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 5) {
      message.error("Image must be smaller than 5MB");
      return Upload.LIST_IGNORE;
    }
    handlePhotoUpload(file);
    return false;
  };

  const handlePhotoUpload = async (file) => {
    try {
      setUploadingPhoto(true);
      setPhotoPreview(URL.createObjectURL(file));
      await updateEmployeeProfilePhoto(id, file);
      message.success("Profile photo update in progress");
      setTimeout(loadEmployee, 3000);
    } catch (error) {
      message.error(error?.response?.data?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* =========================================
     OTP VERIFICATION
  ========================================= */
  const handleVerifyMobileOtp = async () => {
    try {
      await verifyEmployeeMobileOtp(id);
      message.success("Mobile OTP verified");
      loadEmployee();
    } catch (error) {
      message.error(error?.response?.data?.message || "Verification failed");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      await verifyEmployeeEmailOtp(id);
      message.success("Email OTP verified");
      loadEmployee();
    } catch (error) {
      message.error(error?.response?.data?.message || "Verification failed");
    }
  };

  /* =========================================
     RENDER
  ========================================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <Card>
        <Text type="danger">Employee not found.</Text>
        <br />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/employees")}
          style={{ marginTop: 16 }}
        >
          Back to Employees
        </Button>
      </Card>
    );
  }

  const fullName = [employee.firstName, employee.middleName, employee.lastName]
    .filter(Boolean)
    .join(" ");

  const tabItems = [
    /* ----------- TAB 1: OVERVIEW ----------- */
    {
      key: "overview",
      label: "Overview",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Space>
              {employee.profilePhotoThumbnailUrl ? (
                <Avatar src={employee.profilePhotoThumbnailUrl} size={80} />
              ) : (
                <Avatar icon={<UserOutlined />} size={80} />
              )}
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {fullName}
                </Title>
                <Text type="secondary">{employee.email}</Text>
                <br />
                <Tag color={statusColor[employee.userStatus] || "default"}>
                  {employee.userStatus}
                </Tag>
                <Tag color={userTypeColor[employee.userType] || "default"}>
                  {employee.userType}
                </Tag>
              </div>
            </Space>

            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Employee ID">
                {employee.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {employee.mobileNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {employee.email}
              </Descriptions.Item>
              <Descriptions.Item label="Alternate Mobile">
                {employee.alternateMobileNumber || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {employee.gender || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile OTP Verified">
                <Tag color={employee.mobileOtpVerified ? "green" : "red"}>
                  {employee.mobileOtpVerified ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email OTP Verified">
                <Tag color={employee.emailOtpVerified ? "green" : "red"}>
                  {employee.emailOtpVerified ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Referral Code">
                {employee.referralCode || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="My Referral Code">
                {employee.myReferralCode}
              </Descriptions.Item>
            </Descriptions>

            <Space>
              {!employee.mobileOtpVerified && (
                <Popconfirm
                  title="Verify mobile OTP for this employee?"
                  onConfirm={handleVerifyMobileOtp}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="dashed">Mark Mobile OTP Verified</Button>
                </Popconfirm>
              )}
              {!employee.emailOtpVerified && (
                <Popconfirm
                  title="Verify email OTP for this employee?"
                  onConfirm={handleVerifyEmailOtp}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="dashed">Mark Email OTP Verified</Button>
                </Popconfirm>
              )}
            </Space>
          </Space>
        </Card>
      ),
    },

    /* ----------- TAB 2: PERSONAL INFO ----------- */
    {
      key: "personal",
      label: "Personal Info",
      children: (
        <Card bordered={false}>
          <Form form={personalForm} layout="vertical" onFinish={onSavePersonal}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Middle Name" name="middleName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Gender" name="gender">
                  <Select allowClear placeholder="Select gender">
                    <Option value="MALE">Male</Option>
                    <Option value="FEMALE">Female</Option>
                    <Option value="OTHER">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Alternate Mobile"
                  name="alternateMobileNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingPersonal}
                icon={<SaveOutlined />}
              >
                Save Personal Info
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },

    /* ----------- TAB 3: PROFILE PHOTO ----------- */
    {
      key: "photo",
      label: "Profile Photo",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" size="large">
            <div>
              <Title level={5}>Current Profile Photo</Title>
              {employee.profilePhotoOriginalUrl ? (
                <Image
                  src={photoPreview || employee.profilePhotoThumbnailUrl}
                  alt="Profile"
                  width={160}
                  height={160}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <Avatar icon={<UserOutlined />} size={160} />
              )}
            </div>

            <div>
              <Title level={5}>Update Profile Photo</Title>
              <Upload
                beforeUpload={beforePhotoUpload}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploadingPhoto}>
                  Choose New Photo
                </Button>
              </Upload>
              <br />
              <Text type="secondary">
                Max 5MB. Photo will be processed asynchronously.
              </Text>
            </div>
          </Space>
        </Card>
      ),
    },

    /* ----------- TAB 4: STATUS & TYPE ----------- */
    {
      key: "status",
      label: "Status & Type",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Employee Status</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current:{" "}
                <Tag color={statusColor[employee.userStatus] || "default"}>
                  {employee.userStatus}
                </Tag>
              </Text>
              <Select
                value={employee.userStatus}
                onChange={handleStatusChange}
                loading={updatingStatus}
                style={{ width: 200 }}
              >
                {VALID_STATUSES.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </div>

            <Divider />

            <div>
              <Title level={5}>User Type</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current:{" "}
                <Tag color={userTypeColor[employee.userType] || "default"}>
                  {employee.userType}
                </Tag>
              </Text>
              <Select
                value={employee.userType}
                onChange={handleUserTypeChange}
                loading={updatingUserType}
                style={{ width: 200 }}
              >
                {VALID_USER_TYPES.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </div>
          </Space>
        </Card>
      ),
    },

    /* ----------- TAB 5: PASSWORD ----------- */
    {
      key: "password",
      label: "Password",
      children: (
        <Card bordered={false}>
          <Form form={passwordForm} layout="vertical" onFinish={onSavePassword}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Password is required" },
                    { min: 6, message: "Must be at least 6 characters" },
                  ]}
                >
                  <Input.Password placeholder="Enter new password" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingPassword}
                icon={<SaveOutlined />}
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
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
          { title: fullName },
        ]}
      />

      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/employees")}
            />
            <span>{fullName}</span>
          </Space>
        }
      >
        <Tabs defaultActiveKey="overview" items={tabItems} />
      </Card>
    </>
  );
}
