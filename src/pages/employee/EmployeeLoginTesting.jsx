import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import PageHeader from "../../components/common/PageHeader";
import {
  employeeAdminUnlock,
  employeeChangePassword,
  employeeForgotPassword,
  employeeLogin,
  employeeLogout,
  employeeResetPassword,
} from "../../api/employeeAuthApi";

const { Text } = Typography;

const EmployeeLoginTesting = () => {
  const [loadingKey, setLoadingKey] = useState("");
  const [responseText, setResponseText] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("employeeTestJwt") || "",
  );

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [resetForm, setResetForm] = useState({
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changeForm, setChangeForm] = useState({
    identifier: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [unlockEmployeeId, setUnlockEmployeeId] = useState("");

  const handleAction = async (key, action) => {
    try {
      setLoadingKey(key);
      const { data } = await action();
      setResponseText(JSON.stringify(data, null, 2));
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem("employeeTestJwt", data.token);
      }
      message.success(data?.message || "Success");
    } catch (error) {
      const payload = error?.response?.data || {
        success: false,
        message: "Request failed",
      };
      setResponseText(JSON.stringify(payload, null, 2));
      message.error(payload?.message || "Request failed");
    } finally {
      setLoadingKey("");
    }
  };

  const handleLogout = async () => {
    await handleAction("logout", () => employeeLogout(token));
    setToken("");
    localStorage.removeItem("employeeTestJwt");
  };

  return (
    <>
      <PageHeader
        title="Employee Login Testing"
        breadcrumb={["Dashboard", "Employees", "Employee Login Testing"]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Login (Email/Mobile + Password)">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Email or Mobile Number"
                value={loginForm.identifier}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <Button
                type="primary"
                loading={loadingKey === "login"}
                onClick={() =>
                  handleAction("login", () => employeeLogin(loginForm))
                }
              >
                Login
              </Button>
              <Text type="secondary">
                Saved JWT: {token ? "Available" : "Not available"}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Forgot Password (Send OTP)">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Registered Email"
                value={forgotForm.email}
                onChange={(e) =>
                  setForgotForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Button
                type="primary"
                loading={loadingKey === "forgot"}
                onClick={() =>
                  handleAction("forgot", () =>
                    employeeForgotPassword(forgotForm),
                  )
                }
              >
                Send OTP
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Reset Password (OTP Verify)">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Email"
                value={resetForm.email}
                onChange={(e) =>
                  setResetForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                placeholder="OTP Code"
                value={resetForm.otpCode}
                onChange={(e) =>
                  setResetForm((prev) => ({
                    ...prev,
                    otpCode: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="New Password"
                value={resetForm.newPassword}
                onChange={(e) =>
                  setResetForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="Confirm New Password"
                value={resetForm.confirmPassword}
                onChange={(e) =>
                  setResetForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
              <Button
                type="primary"
                loading={loadingKey === "reset"}
                onClick={() =>
                  handleAction("reset", () => employeeResetPassword(resetForm))
                }
              >
                Reset Password
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Change Password">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Email or Mobile Number"
                value={changeForm.identifier}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="Old Password"
                value={changeForm.oldPassword}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="New Password"
                value={changeForm.newPassword}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <Input.Password
                placeholder="Confirm New Password"
                value={changeForm.confirmPassword}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
              <Button
                type="primary"
                loading={loadingKey === "change"}
                onClick={() =>
                  handleAction("change", () =>
                    employeeChangePassword(changeForm),
                  )
                }
              >
                Change Password
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Admin Unlock Employee">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Employee ID"
                value={unlockEmployeeId}
                onChange={(e) => setUnlockEmployeeId(e.target.value)}
              />
              <Button
                type="primary"
                loading={loadingKey === "unlock"}
                onClick={() =>
                  handleAction("unlock", () =>
                    employeeAdminUnlock(unlockEmployeeId),
                  )
                }
              >
                Unlock Now
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Logout">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input.TextArea
                rows={3}
                placeholder="JWT token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Button
                type="primary"
                danger
                loading={loadingKey === "logout"}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Last API Response">
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {responseText || "No response yet"}
            </pre>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeLoginTesting;
