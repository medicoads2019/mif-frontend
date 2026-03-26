import { useState } from "react";
import { Upload, Button, Image, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

/**
 * =========================================
 * ⭐ BannerImageUpload Component
 * =========================================
 *
 * Props:
 *  - initialUrl (string)
 *  - onFileChange(file | null)
 *
 */
const BannerImageUpload = ({ initialUrl, onFileChange }) => {
  /**
   * ⭐ Only store local preview (new file)
   */
  const [localPreview, setLocalPreview] = useState(null);

  /**
   * ⭐ Final preview
   */
  const preview = localPreview || initialUrl;

  /**
   * ⭐ Upload handler
   */
  const handleUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file) return false;

    // notify parent
    onFileChange?.(file);

    // local preview
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result);
    reader.readAsDataURL(file);

    return false; // stop auto upload
  };

  /**
   * ⭐ Remove handler
   */
  const handleRemove = () => {
    setLocalPreview(null);
    onFileChange?.(null);
  };

  return (
    <Space direction="vertical">
      {/* ⭐ Upload */}
      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>
          {preview ? "Replace Image" : "Select Image"}
        </Button>
      </Upload>

      {/* ⭐ Preview */}
      {preview && (
        <>
          <Image src={preview} width={260} style={{ borderRadius: 6 }} />

          <Button danger size="small" onClick={handleRemove}>
            Remove Image
          </Button>
        </>
      )}
    </Space>
  );
};

export default BannerImageUpload;
