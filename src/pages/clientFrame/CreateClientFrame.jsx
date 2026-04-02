import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Breadcrumb,
  Image,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { createClientFrame } from "../../api/clientFrameApi";

const { Title, Text } = Typography;

export default function CreateClientFrame() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
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
        clientFrameName: values.clientFrameName,
        createdBy: values.createdBy,
        uploadedBy: values.uploadedBy,
        coverImage: coverFile,
      };

      const { data } = await createClientFrame(payload);

      if (data?.success) {
        message.success(data.message || "Client frame created successfully");

        form.resetFields();
        setCoverFile(null);
        setPreview(null);

        navigate("/clientFrames");
      } else {
        message.error(data?.message || "Client frame creation failed");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Client frame creation failed",
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

    setCoverFile(file);
    setPreview(URL.createObjectURL(file));

    return false;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* ================================
          BREADCRUMB
      ================================= */}
      <Breadcrumb
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/clientFrames">Client Frames</Link> },
          { title: "Create Client Frame" },
        ]}
      />

      {/* ================================
          MAIN CARD
      ================================= */}
      <Card style={{ maxWidth: 900, margin: "auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* HEADER */}
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Create Client Frame
            </Title>

            <Text type="secondary">
              Add client frame details and optionally upload a cover image
            </Text>
          </div>

          {/* ================================
              FORM
          ================================= */}
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="clientFrameName"
              label="Client Frame Name"
              rules={[
                {
                  required: true,
                  message: "Client frame name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Enter client frame name" />
            </Form.Item>

            <Form.Item
              name="createdBy"
              label="Created By"
              rules={[{ required: true, message: "Creator is required" }]}
            >
              <Input size="large" placeholder="Creator name / ID" />
            </Form.Item>

            <Form.Item
              name="uploadedBy"
              label="Uploaded By"
              rules={[{ required: true, message: "Uploader is required" }]}
            >
              <Input size="large" placeholder="Uploader name / ID" />
            </Form.Item>

            {/* ================================
                COVER IMAGE
            ================================= */}
            <Card size="small" title="Cover Image (Optional)">
              <Space direction="vertical">
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>
                    Select Cover Image (Optional)
                  </Button>
                </Upload>

                {preview && (
                  <Image src={preview} width={220} style={{ marginTop: 8 }} />
                )}
              </Space>
            </Card>

            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Create Client Frame
              </Button>
            </div>
          </Form>
        </Space>
      </Card>
    </Space>
  );
}
