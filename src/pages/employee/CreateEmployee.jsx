import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Select,
  Upload,
  Image,
  Breadcrumb,
  Typography,
  Divider,
} from "antd";

import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { createEmployee } from "../../api/employeeApi";

const { Title } = Typography;
const { Option } = Select;

const VALID_USER_TYPES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPER_HR",
  "HR",
  "MARKETING",
  "MODERATOR",
  "USER",
];

export default function CreateEmployee() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* =========================================
     CLEAN PREVIEW MEMORY
  ========================================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* =========================================
     FORM SUBMIT
  ========================================= */
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        profilePhoto: profileFile || undefined,
      };

      const { data } = await createEmployee(payload);

      if (data?.success) {
        message.success(data.message || "Employee created successfully");
        form.resetFields();
        setProfileFile(null);
        setPreview(null);
        navigate("/employees");
      } else {
        message.error(data?.message || "Employee creation failed");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Employee creation failed",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     IMAGE VALIDATION
  ========================================= */
  const beforeUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 5) {
      message.error("Image must be smaller than 5MB");
      return Upload.LIST_IGNORE;
    }
    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/employees">Employees</Link> },
          { title: "Create Employee" },
        ]}
      />

      <Card>
        <Title level={4} style={{ marginBottom: 24 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Create New Employee
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* -- PERSONAL INFO -- */}
          <Divider orientation="left">Personal Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Middle Name" name="middleName">
                <Input placeholder="Enter middle name (optional)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Enter last name" />
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
                <Select placeholder="Select gender" allowClear>
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="User Type" name="userType">
                <Select placeholder="Select user type" allowClear>
                  {VALID_USER_TYPES.map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* -- CONTACT INFO -- */}
          <Divider orientation="left">Contact Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { required: true, message: "Mobile number is required" },
                ]}
              >
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter password (optional)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Created By" name="createdBy">
                <Input placeholder="Creator identifier (optional)" />
              </Form.Item>
            </Col>
          </Row>

          {/* -- PROFILE PHOTO -- */}
          <Divider orientation="left">Profile Photo (Optional)</Divider>
          <Form.Item label="Profile Photo">
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
            {preview && (
              <div style={{ marginTop: 12 }}>
                <Image
                  src={preview}
                  alt="Preview"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
            )}
          </Form.Item>

          {/* -- BUTTONS -- */}
          <Form.Item style={{ marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: 8 }}
            >
              Create Employee
            </Button>
            <Button onClick={() => navigate("/employees")}>Cancel</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
