import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Space,
  Typography,
  Upload,
  Image,
  Breadcrumb,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { createCategory } from "../../api/categoryApi";

const { Title, Text } = Typography;

export default function CreateCategory() {
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
      if (!coverFile) {
        message.warning("Please upload a cover image");
        return;
      }

      setLoading(true);

      const payload = {
        ...values,
        coverImage: coverFile,
      };

      const { data } = await createCategory(payload);

      if (data?.success) {
        message.success(data.message || "Category created successfully");

        form.resetFields();
        setCoverFile(null);
        setPreview(null);

        navigate("/categorys");
      } else {
        message.error(data?.message || "Category creation failed");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Category creation failed",
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
          {
            title: <Link to="/">Dashboard</Link>,
          },
          {
            title: <Link to="/categorys">Categorys</Link>,
          },
          {
            title: "Create Category",
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
              Create Category
            </Title>

            <Text type="secondary">
              Add category details and upload a cover image
            </Text>
          </div>

          {/* ================================
              FORM
          ================================= */}
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="categoryName"
                  label="Category Name"
                  rules={[
                    {
                      required: true,
                      message: "Category name is required",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter category name" />
                </Form.Item>
              </Col>

              <Col span={12}>
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
              </Col>

              <Col span={12}>
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
              </Col>
            </Row>

            {/* ================================
                COVER IMAGE
            ================================= */}
            <Card size="small" title="Cover Image">
              <Space direction="vertical">
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select Cover Image</Button>
                </Upload>

                {preview && (
                  <Image
                    src={preview}
                    width={220}
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
                Create Category
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
