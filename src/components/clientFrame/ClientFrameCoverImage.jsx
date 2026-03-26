import { Card, Image, Upload, Button, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function ClientFrameCoverImage({
  clientFrame,
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
      {clientFrame?.coverThumbnailUrl ? (
        <Image src={clientFrame.coverThumbnailUrl} width={260} />
      ) : (
        <Text type="secondary">No cover image</Text>
      )}
    </Card>
  );
}
