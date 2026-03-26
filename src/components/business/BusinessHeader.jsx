import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateBusinessStatus } from "../../api/businessApi";

const { Title } = Typography;

export default function BusinessHeader({ business, navigate, reloadBusiness }) {
  /* ===============================
     APPROVE BUSINESS
  =============================== */

  const handleApproveBusiness = async () => {
    try {
      await updateBusinessStatus(business.businessId, "APPROVED");

      message.success("Business approved successfully");

      reloadBusiness?.();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT BUSINESS
  =============================== */

  const handleRejectBusiness = async () => {
    try {
      await updateBusinessStatus(business.businessId, "REJECTED");

      message.success("Business rejected successfully");

      reloadBusiness?.();
    } catch (error) {
      console.error(error);
      message.error("Reject failed");
    }
  };

  /* ===============================
     STATUS TAG
  =============================== */

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
            onClick={() => navigate("/businesss")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {business?.businessName}
          </Title>

          {business?.businessStatus && (
            <Tag color={statusColor[business.businessStatus]}>
              {business.businessStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE BUTTONS */}
      <Col>
        <Space>
          {business?.businessStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveBusiness}
              >
                Approve Business
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleRejectBusiness}
              >
                Reject Business
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/businesss")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
