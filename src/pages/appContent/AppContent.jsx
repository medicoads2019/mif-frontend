import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Space, message } from "antd";
import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";

import PageHeader from "../../components/common/PageHeader";
import { getAppContent, updateAppContent } from "../../api/appContentApi";

const initialValues = {
  privacyPolicy: "",
  termsAndConditions: "",
};

export default function AppContent() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data } = await getAppContent();
      form.setFieldsValue({
        privacyPolicy: data?.data?.privacyPolicy || "",
        termsAndConditions: data?.data?.termsAndConditions || "",
      });
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message || "Failed to load app content",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await updateAppContent(values);
      messageApi.success("App content updated");
      await fetchContent();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      messageApi.error(
        error?.response?.data?.message || "Failed to update app content",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {contextHolder}

      <PageHeader
        title="Legal Content"
        breadcrumb={["Dashboard", "Legal Content"]}
        extra={
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={fetchContent}>
              Refresh
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save Content
            </Button>
          </Space>
        }
      />

      <Card loading={loading}>
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item label="Privacy Policy" name="privacyPolicy">
            <Input.TextArea rows={14} placeholder="Enter privacy policy text" />
          </Form.Item>

          <Form.Item label="Terms and Conditions" name="termsAndConditions">
            <Input.TextArea
              rows={14}
              placeholder="Enter terms and conditions text"
            />
          </Form.Item>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
          >
            Save Content
          </Button>
        </Form>
      </Card>
    </>
  );
}
