import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { employeeForgotPassword } from "../../api/employeeAuthApi";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const { data } = await employeeForgotPassword(values);
      message.success(data?.message || "OTP sent successfully");
      navigate("/auth/reset-password", { state: { email: values.email } });
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        padding: 16,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              Forgot Password
            </Title>
            <Text type="secondary">
              We will send OTP to your registered email
            </Text>
          </div>

          {errorMessage ? <Alert type="error" message={errorMessage} /> : null}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Registered Email" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Send OTP
            </Button>
          </Form>

          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Link to="/auth/login">Back to login</Link>
            <Link to="/auth/reset-password">Go to reset password</Link>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
