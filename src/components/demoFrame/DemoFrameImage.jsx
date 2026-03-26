import { Card, Image, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function DemoFrameImage({ demoFrame, handleUpload, loading }) {
  return (
    <Card
      title="DemoFrame Image"
      extra={
        <Upload showUploadList={false} beforeUpload={handleUpload}>
          <Button icon={<UploadOutlined />} loading={loading}>
            Update Image
          </Button>
        </Upload>
      }
    >
      {demoFrame?.thumbnailUrl && (
        <Image src={demoFrame.thumbnailUrl} width={350} />
      )}
    </Card>
  );
}
