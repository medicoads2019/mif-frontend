import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateBannerStatus } from "../../api/bannerApi";

const { Title } = Typography;

export default function BannerHeader({ banner, navigate, reloadBanner }) {
  const handleApproveBanner = async () => {
    try {
      await updateBannerStatus(banner.bannerId, "APPROVED");

      message.success("Banner approved");

      reloadBanner?.();
    } catch (error) {
      message.error("Approve failed");
    }
  };

  const handleRejectBanner = async () => {
    try {
      await updateBannerStatus(banner.bannerId, "REJECTED");

      message.success("Banner rejected");

      reloadBanner?.();
    } catch (error) {
      message.error("Reject failed");
    }
  };

  const statusColor = {
    APPROVED: "green",
    PENDING: "orange",
    REJECTED: "red",
    DELETED: "volcano",
  };

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        background: "#fff",
        padding: "16px 20px",
        borderRadius: 8,
      }}
    >
      {/* LEFT SIDE */}
      <Col>
        <Space align="center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/banners")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {banner?.bannerName}
          </Title>

          {banner?.bannerStatus && (
            <Tag color={statusColor[banner.bannerStatus]}>
              {banner.bannerStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE */}
      <Col>
        <Space>
          {banner?.bannerStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveBanner}
              >
                Approve Banner
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleRejectBanner}
              >
                Reject Banner
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/banners")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
