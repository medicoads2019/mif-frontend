import { Card, Image, Upload, Button, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function BusinessFrameCoverImage({
  businessFrame,
  handleCoverUpload,
  coverUploading,
}) {
  return (
    <Card
      title="Cover Image"
      extra={
        <Upload
          showUploadList={false}
          beforeUpload={handleCoverUpload}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={coverUploading}>
            Update Cover Image
          </Button>
        </Upload>
      }
    >
      {businessFrame?.coverThumbnailUrl ? (
        <Image src={businessFrame.coverThumbnailUrl} width={260} />
      ) : (
        <Text type="secondary">No cover image</Text>
      )}
    </Card>
  );
}
