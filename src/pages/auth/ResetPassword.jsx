import { useMemo, useState } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { employeeResetPassword } from "../../api/employeeAuthApi";

const { Title, Text } = Typography;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = useMemo(() => location.state?.email || "", [location]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const { data } = await employeeResetPassword(values);
      message.success(data?.message || "Password reset successful");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Password reset failed",
      );
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
      <Card style={{ width: "100%", maxWidth: 460 }}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              Reset Password
            </Title>
            <Text type="secondary">Enter OTP and new password</Text>
          </div>

          {errorMessage ? <Alert type="error" message={errorMessage} /> : null}

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ email: initialEmail }}
          >
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

            <Form.Item
              label="OTP Code"
              name="otpCode"
              rules={[{ required: true, message: "Please enter OTP" }]}
            >
              <Input placeholder="OTP Code" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: "Please enter new password" }]}
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form>

          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Link to="/auth/login">Back to login</Link>
            <Link to="/auth/forgot-password">Resend OTP</Link>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
