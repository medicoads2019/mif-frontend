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

import { createDemoFrame } from "../../api/demoFrameApi";

const { Title, Text } = Typography;

export default function CreateDemoFrame() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [demoFrameFile, setDemoFrameFile] = useState(null);
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
      if (!demoFrameFile) {
        message.warning("Please upload a demoFrame image");
        return;
      }

      setLoading(true);

      const payload = {
        demoFrameName: values.demoFrameName,
        createdBy: values.createdBy,
        uploadedBy: values.uploadedBy,
        demoFrameImage: demoFrameFile,
      };

      const { data } = await createDemoFrame(payload);

      if (data?.success) {
        message.success(data.message || "DemoFrame created successfully");

        form.resetFields();
        setDemoFrameFile(null);
        setPreview(null);

        navigate("/demoFrames");
      } else {
        message.error(data?.message || "DemoFrame creation failed");
      }
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "DemoFrame creation failed",
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

    setDemoFrameFile(file);
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
          {
            title: <Link to="/">Dashboard</Link>,
          },
          {
            title: <Link to="/demoFrames">DemoFrames</Link>,
          },
          {
            title: "Create DemoFrame",
          },
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
              Create DemoFrame
            </Title>

            <Text type="secondary">
              Add demoFrame details and upload a demoFrame image
            </Text>
          </div>

          {/* ================================
              FORM
          ================================= */}

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="demoFrameName"
              label="DemoFrame Name"
              rules={[
                {
                  required: true,
                  message: "DemoFrame name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Enter demoFrame name" />
            </Form.Item>

            <Form.Item
              name="createdBy"
              label="Created By"
              rules={[
                {
                  required: true,
                  message: "Creator is required",
                },
              ]}
            >
              <Input size="large" placeholder="Creator name / ID" />
            </Form.Item>

            <Form.Item
              name="uploadedBy"
              label="Uploaded By"
              rules={[
                {
                  required: true,
                  message: "Uploader is required",
                },
              ]}
            >
              <Input size="large" placeholder="Uploader name / ID" />
            </Form.Item>

            {/* ================================
                DEMOFRAME IMAGE
            ================================= */}

            <Card size="small" title="DemoFrame Image">
              <Space direction="vertical">
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>
                    Select DemoFrame Image
                  </Button>
                </Upload>

                {preview && (
                  <Image
                    src={preview}
                    width={400}
                    style={{ borderRadius: 8 }}
                  />
                )}
              </Space>
            </Card>

            {/* ================================
                ACTION BUTTONS
            ================================= */}

            <Space style={{ marginTop: 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Create DemoFrame
              </Button>

              <Button size="large" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Space>
      </Card>
    </Space>
  );
}
