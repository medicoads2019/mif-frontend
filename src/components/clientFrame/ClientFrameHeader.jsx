import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateClientFrameStatus } from "../../api/clientFrameApi";

const { Title } = Typography;

export default function ClientFrameHeader({
  clientFrame,
  navigate,
  reloadClientFrame,
}) {
  /* ===============================
     APPROVE CLIENT FRAME
  =============================== */

  const handleApprove = async () => {
    try {
      await updateClientFrameStatus(clientFrame.clientFrameId, "APPROVED");

      message.success("Client frame approved successfully");

      reloadClientFrame?.();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT CLIENT FRAME
  =============================== */

  const handleReject = async () => {
    try {
      await updateClientFrameStatus(clientFrame.clientFrameId, "REJECTED");

      message.success("Client frame rejected successfully");

      reloadClientFrame?.();
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
            onClick={() => navigate("/clientFrames")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {clientFrame?.clientFrameName}
          </Title>

          {clientFrame?.clientFrameStatus && (
            <Tag color={statusColor[clientFrame.clientFrameStatus]}>
              {clientFrame.clientFrameStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE */}
      <Col>
        <Space>
          {clientFrame?.clientFrameStatus === "PENDING" && (
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

          <Button onClick={() => navigate("/clientFrames")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
