import {
  Drawer,
  Space,
  Row,
  Col,
  Statistic,
  Button,
  Divider,
  Tag,
  Typography,
  Descriptions,
} from "antd";

const { Title } = Typography;

export default function ImageDrawer({
  selectedImage,
  setSelectedImage,
  handleApprove,
  handleReject,
  handleSoftDelete,
  handleRestore,
  handleHardDelete,
}) {
  if (!selectedImage) return null;

  const isDeleted = Boolean(selectedImage.softDelete);

  const statusColor = {
    APPROVED: "green",
    PENDING: "orange",
    REJECTED: "red",
    DELETED: "volcano",
  };

  return (
    <Drawer
      open={!!selectedImage}
      onClose={() => setSelectedImage(null)}
      width={650}
      title={isDeleted ? "Deleted Image" : "Image Details"}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* STATUS */}

        <Space>
          <Title level={5} style={{ margin: 0 }}>
            Status
          </Title>

          <Tag color={statusColor[selectedImage.status]}>
            {selectedImage.status}
          </Tag>

          {isDeleted && <Tag color="volcano">SOFT DELETED</Tag>}
        </Space>

        {/* STATISTICS */}

        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Views" value={selectedImage.viewCount} />
          </Col>

          <Col span={8}>
            <Statistic title="Likes" value={selectedImage.likeCount} />
          </Col>

          <Col span={8}>
            <Statistic title="Downloads" value={selectedImage.downloadCount} />
          </Col>
        </Row>

        <Divider />

        {/* METADATA */}

        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Image ID">
            {selectedImage.id}
          </Descriptions.Item>

          <Descriptions.Item label="Category ID">
            {selectedImage.categoryId}
          </Descriptions.Item>

          <Descriptions.Item label="Orientation">
            {selectedImage.orientation}
          </Descriptions.Item>

          <Descriptions.Item label="Access Type">
            {selectedImage.userTypeAccess}
          </Descriptions.Item>

          <Descriptions.Item label="Created By">
            {selectedImage.createdBy || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Uploaded By">
            {selectedImage.uploadedBy || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {selectedImage.createdAt || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Published At">
            {selectedImage.publishedAt || "-"}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* ACTION BUTTONS */}

        {!isDeleted && (
          <Space>
            {selectedImage.status !== "APPROVED" && (
              <Button
                type="primary"
                onClick={() => {
                  handleApprove(selectedImage.id);
                  setSelectedImage(null);
                }}
              >
                Approve
              </Button>
            )}

            {selectedImage.status !== "REJECTED" && (
              <Button
                onClick={() => {
                  handleReject(selectedImage.id);
                  setSelectedImage(null);
                }}
              >
                Reject
              </Button>
            )}

            <Button
              danger
              onClick={() => {
                handleSoftDelete(selectedImage.id);
                setSelectedImage(null);
              }}
            >
              Soft Delete
            </Button>
          </Space>
        )}

        {isDeleted && (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                handleRestore(selectedImage.id);
                setSelectedImage(null);
              }}
            >
              Restore
            </Button>

            <Button
              danger
              onClick={() => {
                handleHardDelete(selectedImage.id);
                setSelectedImage(null);
              }}
            >
              Hard Delete
            </Button>
          </Space>
        )}
      </Space>
    </Drawer>
  );
}
