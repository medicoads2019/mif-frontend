import { useMemo, useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import PageHeader from "../../components/common/PageHeader";
import { employeeChangePassword } from "../../api/employeeAuthApi";
import { useAuth } from "../../auth/AuthContext";

export default function ChangePassword() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { employee } = useAuth();

  const identifier = useMemo(
    () => employee?.email || employee?.mobileNumber || "",
    [employee],
  );

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        identifier,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      const { data } = await employeeChangePassword(payload);
      message.success(data?.message || "Password changed successfully");
      form.resetFields(["oldPassword", "newPassword", "confirmPassword"]);
    } catch (error) {
      message.error(error?.response?.data?.message || "Change password failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Change Password"
        breadcrumb={["Dashboard", "Profile", "Change Password"]}
      />

      <Card style={{ maxWidth: 560 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ identifier }}
        >
          <Form.Item label="Identifier">
            <Input value={identifier} disabled />
          </Form.Item>

          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: "Please enter old password" }]}
          >
            <Input.Password />
          </Form.Item>

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
            Update Password
          </Button>
        </Form>
      </Card>
    </>
  );
}
