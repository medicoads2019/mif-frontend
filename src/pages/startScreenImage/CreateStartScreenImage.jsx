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

import { createStartScreenImage } from "../../api/startScreenImageApi";

const { Title, Text } = Typography;

export default function CreateStartScreenImage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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
      if (!imageFile) {
        message.warning("Please upload a start screen image");
        return;
      }

      setLoading(true);

      const payload = {
        imageName: values.imageName,
        createdBy: values.createdBy,
        startScreenImage: imageFile,
      };

      const { data } = await createStartScreenImage(payload);

      if (data?.success) {
        message.success(
          data.message || "Start screen image created successfully",
        );

        form.resetFields();
        setImageFile(null);
        setPreview(null);

        navigate("/start-screen-images");
      } else {
        message.error(data?.message || "Creation failed");
      }
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message || error?.message || "Creation failed",
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

    setImageFile(file);
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
            title: <Link to="/start-screen-images">Start Screen Images</Link>,
          },
          {
            title: "Create Image",
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
              Create Start Screen Image
            </Title>

            <Text type="secondary">
              Add a portrait image to display on the app start screen
            </Text>
          </div>

          {/* ================================
              FORM
          ================================= */}

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="imageName"
              label="Image Name"
              rules={[
                {
                  required: true,
                  message: "Image name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Enter image name" />
            </Form.Item>

            <Form.Item name="createdBy" label="Created By">
              <Input size="large" placeholder="Creator name / ID (optional)" />
            </Form.Item>

            {/* ================================
                IMAGE UPLOAD
            ================================= */}

            <Card size="small" title="Start Screen Image (Portrait)">
              <Space direction="vertical">
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>

                {preview && (
                  <Image
                    src={preview}
                    width={200}
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
                Create Image
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
