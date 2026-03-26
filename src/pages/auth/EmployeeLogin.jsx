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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { employeeLogin } from "../../api/employeeAuthApi";
import { useAuth } from "../../auth/AuthContext";
import { getDefaultPathForRole } from "../../auth/rbac";

const { Title, Text } = Typography;

export default function EmployeeLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data } = await employeeLogin(values);
      const employee = data?.data || null;
      const token = data?.token || "";

      if (!employee || !token) {
        setErrorMessage("Invalid login response from server");
        return;
      }

      login({ token, employee });
      message.success(data?.message || "Login successful");

      const redirectPath =
        location.state?.from?.pathname ||
        getDefaultPathForRole(employee.userType);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Login failed");
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
              Employee Login
            </Title>
            <Text type="secondary">Login with email or mobile number</Text>
          </div>

          {errorMessage ? <Alert type="error" message={errorMessage} /> : null}

          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="Email or Mobile Number"
              name="identifier"
              rules={[
                { required: true, message: "Please enter email or mobile" },
              ]}
            >
              <Input placeholder="Email or Mobile Number" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form>

          <div style={{ textAlign: "right" }}>
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
}
