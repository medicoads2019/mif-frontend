import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateDemoFrameStatus } from "../../api/demoFrameApi";

const { Title } = Typography;

export default function DemoFrameHeader({
  demoFrame,
  navigate,
  reloadDemoFrame,
}) {
  const handleApproveDemoFrame = async () => {
    try {
      await updateDemoFrameStatus(demoFrame.demoFrameId, "APPROVED");

      message.success("DemoFrame approved");

      reloadDemoFrame?.();
    } catch (error) {
      message.error("Approve failed");
    }
  };

  const handleRejectDemoFrame = async () => {
    try {
      await updateDemoFrameStatus(demoFrame.demoFrameId, "REJECTED");

      message.success("DemoFrame rejected");

      reloadDemoFrame?.();
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
            onClick={() => navigate("/demoFrames")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {demoFrame?.demoFrameName}
          </Title>

          {demoFrame?.demoFrameStatus && (
            <Tag color={statusColor[demoFrame.demoFrameStatus]}>
              {demoFrame.demoFrameStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE */}
      <Col>
        <Space>
          {demoFrame?.demoFrameStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveDemoFrame}
              >
                Approve DemoFrame
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleRejectDemoFrame}
              >
                Reject DemoFrame
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/demoFrames")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
