import { Card, Image, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function BannerImage({ banner, handleUpload, loading }) {
  return (
    <Card
      title="Banner Image"
      extra={
        <Upload showUploadList={false} beforeUpload={handleUpload}>
          <Button icon={<UploadOutlined />} loading={loading}>
            Update Image
          </Button>
        </Upload>
      }
    >
      {banner?.thumbnailUrl && <Image src={banner.thumbnailUrl} width={350} />}
    </Card>
  );
}
