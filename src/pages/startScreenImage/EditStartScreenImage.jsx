import { useCallback, useEffect, useState } from "react";
import {
  Space,
  Spin,
  Breadcrumb,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Upload,
  Image,
  message,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  getStartScreenImageById,
  updateStartScreenImageName,
  updateStartScreenImageFile,
  updateStartScreenImageStatus,
  updateShowInStartScreen,
} from "../../api/startScreenImageApi";

const { Title, Text } = Typography;

export default function EditStartScreenImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  /* ===============================
     LOAD RECORD
  =============================== */

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getStartScreenImageById(id);
      const data = res?.data?.data;

      setItem(data);

      form.setFieldsValue({
        imageName: data.imageName,
        status: data.status,
        showInStartScreen: data.showInStartScreen,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load start screen image");
    } finally {
      setLoading(false);
    }
  }, [form, id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  /* ===============================
     UPDATE FIELDS
  =============================== */

  const onFinish = async (values) => {
    try {
      setSaving(true);

      const promises = [];

      if (values.imageName !== item.imageName) {
        promises.push(updateStartScreenImageName(id, values.imageName));
      }

      if (values.status !== item.status) {
        promises.push(updateStartScreenImageStatus(id, values.status));
      }

      if (values.showInStartScreen !== item.showInStartScreen) {
        promises.push(updateShowInStartScreen(id, values.showInStartScreen));
      }

      await Promise.all(promises);

      message.success("Updated successfully");
      loadItem();
    } catch (error) {
      console.error(error);
      message.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     REPLACE IMAGE
  =============================== */

  const beforeUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return Upload.LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 > 5) {
      message.error("Image must be smaller than 5MB");
      return Upload.LIST_IGNORE;
    }

    handleImageUpload(file);
    return false;
  };

  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true);

      await updateStartScreenImageFile(id, file);

      message.success("Image updated successfully");
      loadItem();
    } catch (error) {
      console.error(error);
      message.error("Image update failed");
    } finally {
      setImageUploading(false);
    }
  };

  /* ===============================
     LOADING STATE
  =============================== */

  if (loading || !item) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* ================= Breadcrumb ================= */}

      <Breadcrumb
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/start-screen-images">Start Screen Images</Link> },
          { title: item?.imageName },
        ]}
      />

      {/* ================= Header ================= */}

      <Card>
        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="start"
        >
          <Space direction="vertical" size={4}>
            <Title level={4} style={{ marginBottom: 2 }}>
              {item.imageName}
            </Title>
            <Space wrap>
              <Text type="secondary">Index: {item.indexValue}</Text>
              <Tag color={item.status === "ACTIVE" ? "green" : "default"}>
                {item.status}
              </Tag>
              <Tag color={item.showInStartScreen ? "blue" : "default"}>
                {item.showInStartScreen
                  ? "VISIBLE ON START"
                  : "HIDDEN ON START"}
              </Tag>
            </Space>
          </Space>

          <Button onClick={() => navigate(-1)}>Back</Button>
        </Space>
      </Card>

      {/* ================= Details Form ================= */}

      <Card title="Edit Details">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            name="imageName"
            label="Image Name"
            rules={[{ required: true, message: "Image name is required" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select size="large">
              <Select.Option value="ACTIVE">ACTIVE</Select.Option>
              <Select.Option value="INACTIVE">INACTIVE</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="showInStartScreen"
            label="Show in Start Screen"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
            >
              Save Changes
            </Button>

            <Button size="large" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>

      {/* ================= Image Section ================= */}

      <Card title="Start Screen Image">
        <Row gutter={24} align="middle">
          <Col>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                width={180}
                style={{ borderRadius: 10, objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 180,
                  height: 260,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Text type="secondary">No Image</Text>
              </div>
            )}
          </Col>

          <Col>
            <Space direction="vertical">
              <Text type="secondary">Replace Image (portrait recommended)</Text>
              <Divider style={{ margin: "8px 0" }} />
              <Upload
                beforeUpload={beforeUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={imageUploading}>
                  Upload New Image
                </Button>
              </Upload>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}
