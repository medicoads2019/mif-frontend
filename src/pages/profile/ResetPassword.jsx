import { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import PageHeader from "../../components/common/PageHeader";
import { updateEmployeePassword } from "../../api/employeeApi";
import { useAuth } from "../../auth/AuthContext";

export default function ProfileResetPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { employee } = useAuth();

  const handleSubmit = async (values) => {
    try {
      if (!employee?._id) {
        message.error("Employee session is missing. Please login again.");
        return;
      }

      setSubmitting(true);
      const { data } = await updateEmployeePassword(
        employee._id,
        values.newPassword,
      );
      message.success(data?.message || "Password reset successful");
      form.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Reset password failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Reset Password"
        breadcrumb={["Dashboard", "Profile", "Reset Password"]}
      />

      <Card style={{ maxWidth: 560 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please enter new password" }]}
          >
            <Input.Password />
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
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Reset Password
          </Button>
        </Form>
      </Card>
    </>
  );
}
