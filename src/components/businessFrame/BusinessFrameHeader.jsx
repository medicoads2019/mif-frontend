import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateBusinessFrameStatus } from "../../api/businessFrameApi";

const { Title } = Typography;

export default function BusinessFrameHeader({
  businessFrame,
  navigate,
  reloadBusinessFrame,
}) {
  /* ===============================
     APPROVE BUSINESS FRAME
  =============================== */

  const handleApprove = async () => {
    try {
      await updateBusinessFrameStatus(
        businessFrame.businessFrameId,
        "APPROVED",
      );

      message.success("Business frame approved successfully");

      reloadBusinessFrame?.();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT BUSINESS FRAME
  =============================== */

  const handleReject = async () => {
    try {
      await updateBusinessFrameStatus(
        businessFrame.businessFrameId,
        "REJECTED",
      );

      message.success("Business frame rejected successfully");

      reloadBusinessFrame?.();
    } catch (error) {
      console.error(error);
      message.error("Reject failed");
    }
  };

  /* ===============================
     STATUS TAG COLOR
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
            onClick={() => navigate("/businessFrames")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {businessFrame?.businessFrameName}
          </Title>

          {businessFrame?.businessFrameStatus && (
            <Tag color={statusColor[businessFrame.businessFrameStatus]}>
              {businessFrame.businessFrameStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE */}
      <Col>
        <Space>
          {businessFrame?.businessFrameStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                Approve
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/businessFrames")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
