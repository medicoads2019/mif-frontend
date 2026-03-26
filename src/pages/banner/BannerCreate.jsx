import { Breadcrumb, Card, message, Typography, Space } from "antd";
import { HomeOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BannerForm from "../../components/banner/BannerForm";

const { Title, Text } = Typography;

/**
 * =========================================
 * ⭐ BannerCreate Page
 * =========================================
 */
const BannerCreate = () => {
  const navigate = useNavigate();

  /**
   * ⭐ After successful create
   */
  const handleSuccess = () => {
    message.success("Banner created successfully");
    navigate("/banners");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* ⭐ Header Section */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 50%, #ffffff 100%)",
          border: "1px solid #e6f4ff",
        }}
        styles={{ body: { padding: 18 } }}
      >
        <Space orientation="vertical" size={2}>
          <Breadcrumb
            items={[
              {
                title: <HomeOutlined />,
                onClick: () => navigate("/"),
              },
              {
                title: (
                  <>
                    <PictureOutlined /> Banners
                  </>
                ),
                onClick: () => navigate("/banners"),
              },
              {
                title: (
                  <>
                    <PlusOutlined /> Create
                  </>
                ),
              },
            ]}
          />

          <Title level={3} style={{ margin: 0 }}>
            Create Banner
          </Title>

          <Text type="secondary">
            Upload banner image and configure banner properties for display
          </Text>
        </Space>
      </Card>

      {/* ⭐ Form Card */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 22px rgba(0,0,0,0.05)",
        }}
        styles={{ body: { padding: 28 } }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <BannerForm onSuccess={handleSuccess} />
        </div>
      </Card>
    </div>
  );
};

export default BannerCreate;
