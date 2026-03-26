import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import PageHeader from "../../components/common/PageHeader";
import { updateEmployeePersonalInfo } from "../../api/employeeApi";
import { useAuth } from "../../auth/AuthContext";

export default function ProfileUpdate() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { employee, updateEmployee } = useAuth();

  const initialValues = useMemo(
    () => ({
      firstName: employee?.firstName || "",
      middleName: employee?.middleName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
      mobileNumber: employee?.mobileNumber || "",
      dateOfBirth: employee?.dateOfBirth || undefined,
      gender: employee?.gender || undefined,
    }),
    [employee],
  );

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const handleSubmit = async (values) => {
    try {
      if (!employee?._id) {
        message.error("Employee session is missing. Please login again.");
        return;
      }

      setSubmitting(true);
      const { data } = await updateEmployeePersonalInfo(employee._id, values);
      if (data?.data) {
        updateEmployee(data.data);
      }
      message.success(data?.message || "Profile updated successfully");
    } catch (error) {
      message.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Update Profile"
        breadcrumb={["Dashboard", "Profile", "Update Profile"]}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Middle Name" name="middleName">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Date of Birth" name="dateOfBirth">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Gender" name="gender">
                <Select
                  allowClear
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Profile
          </Button>
        </Form>
      </Card>
    </>
  );
}
