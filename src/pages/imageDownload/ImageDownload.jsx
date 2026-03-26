import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Typography,
  Breadcrumb,
  Image,
  Divider,
  Row,
  Col,
  Alert,
  Spin,
} from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  downloadMergedImage,
  previewMergedImage,
} from "../../api/imageDownloadApi";

const { Title, Text, Paragraph } = Typography;

export default function ImageDownload() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  /* =========================================
     CLEAR PREVIEW MEMORY ON URL CHANGE
  ========================================= */
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  /* =========================================
     PREVIEW
  ========================================= */
  const handlePreview = async () => {
    const values = await form.validateFields();
    clearPreview();
    setPreviewing(true);

    try {
      const response = await previewMergedImage(
        values.selectedFrameId.trim(),
        values.festivalImageId.trim(),
      );

      const blobUrl = URL.createObjectURL(response.data);
      setPreviewUrl(blobUrl);
      message.success("Preview generated successfully");
    } catch (err) {
      const msg =
        err?.response?.data instanceof Blob
          ? await err.response.data.text().then((t) => {
              try {
                return JSON.parse(t)?.message;
              } catch {
                return t;
              }
            })
          : err?.message || "Failed to generate preview";

      setError(msg);
      message.error(msg);
    } finally {
      setPreviewing(false);
    }
  };

  /* =========================================
     DOWNLOAD
  ========================================= */
  const handleDownload = async () => {
    const values = await form.validateFields();
    clearPreview();
    setLoading(true);

    try {
      const response = await downloadMergedImage(
        values.selectedFrameId.trim(),
        values.festivalImageId.trim(),
      );

      // Extract filename from Content-Disposition header if present
      const contentDisposition = response.headers?.["content-disposition"];
      let filename = `merged_${Date.now()}.png`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) filename = match[1];
      }

      // Trigger browser download
      const blobUrl = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);

      message.success("Image downloaded successfully!");
    } catch (err) {
      const msg =
        err?.response?.data instanceof Blob
          ? await err.response.data.text().then((t) => {
              try {
                return JSON.parse(t)?.message;
              } catch {
                return t;
              }
            })
          : err?.message || "Download failed";

      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ⭐ Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: "Image Download" },
        ]}
      />

      {/* ⭐ Page Title */}
      <Title level={3} style={{ marginBottom: 4 }}>
        <PictureOutlined style={{ marginRight: 8 }} />
        Image Download
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Enter a Frame ID and a Festival Image ID to merge the frame with the
        festival image and download the result. The frame will appear in front
        of the festival image.
      </Paragraph>

      <Row gutter={[24, 24]}>
        {/* ⭐ Input Form */}
        <Col xs={24} lg={12}>
          <Card
            title="Merge & Download"
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          >
            <Form form={form} layout="vertical" autoComplete="off">
              {/* Frame ID */}
              <Form.Item
                label="Selected Frame ID"
                name="selectedFrameId"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Frame ID",
                  },
                  {
                    whitespace: true,
                    message: "Frame ID cannot be blank",
                  },
                ]}
                tooltip="MongoDB ObjectId of the frame (DemoFrame, BusinessFrame, or ClientFrame)"
              >
                <Input
                  placeholder="e.g. 6650a1b2c3d4e5f678901234"
                  size="large"
                  allowClear
                  onChange={clearPreview}
                />
              </Form.Item>

              {/* Festival Image ID */}
              <Form.Item
                label="Festival Image ID"
                name="festivalImageId"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Festival Image ID",
                  },
                  {
                    whitespace: true,
                    message: "Festival Image ID cannot be blank",
                  },
                ]}
                tooltip="MongoDB ObjectId of the FestivalImage document. Its original imageUrl will be used as the background."
              >
                <Input
                  placeholder="e.g. 6650a1b2c3d4e5f678901234"
                  size="large"
                  allowClear
                  onChange={clearPreview}
                />
              </Form.Item>

              <Divider />

              {/* Action Buttons */}
              <Space size="middle" wrap>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  size="large"
                  loading={previewing}
                  onClick={handlePreview}
                >
                  Preview
                </Button>

                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  loading={loading}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </Space>
            </Form>

            {/* Error Alert */}
            {error && (
              <Alert
                type="error"
                message={error}
                style={{ marginTop: 16 }}
                showIcon
                closable
                afterClose={() => setError(null)}
              />
            )}
          </Card>
        </Col>

        {/* ⭐ Preview Panel */}
        <Col xs={24} lg={12}>
          <Card
            title="Preview"
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          >
            {previewing ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" tip="Generating preview…" />
              </div>
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt="Merged preview"
                style={{ width: "100%", borderRadius: 8 }}
                placeholder={
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <Spin />
                  </div>
                }
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#aaa",
                }}
              >
                <PictureOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                <br />
                <Text type="secondary">
                  Click <strong>Preview</strong> to see the merged image here
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* ⭐ Help Card */}
      <Card
        style={{ marginTop: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
        bordered={false}
      >
        <Title level={5}>How it works</Title>
        <ul style={{ paddingLeft: 20, lineHeight: "2em" }}>
          <li>
            <strong>Selected Frame ID</strong> – the MongoDB ObjectId of a
            DemoFrame, BusinessFrame, or ClientFrame. The service automatically
            searches all three collections.
          </li>
          <li>
            <strong>Festival ID</strong> – the MongoDB ObjectId of the Festival.
            The backend automatically picks the first approved, non-deleted
            image belonging to that festival and uses it as the background.
          </li>
          <li>
            The festival image is used as the <strong>background</strong>; the
            frame is composited on top at full size.
          </li>
          <li>
            Both the <strong>Preview</strong> and <strong>Download</strong>{" "}
            produce a high-quality PNG.
          </li>
        </ul>
      </Card>
    </>
  );
}
