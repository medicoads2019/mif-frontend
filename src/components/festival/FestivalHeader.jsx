import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateFestivalStatus } from "../../api/festivalApi";

const { Title } = Typography;

export default function FestivalHeader({ festival, navigate, reloadFestival }) {
  /* ===============================
     APPROVE FESTIVAL
  =============================== */

  const handleApproveFestival = async () => {
    try {
      await updateFestivalStatus(festival.festivalId, "APPROVED");

      message.success("Festival approved successfully");

      reloadFestival?.();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT FESTIVAL
  =============================== */

  const handleRejectFestival = async () => {
    try {
      await updateFestivalStatus(festival.festivalId, "REJECTED");

      message.success("Festival rejected successfully");

      reloadFestival?.();
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
            onClick={() => navigate("/festivals")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {festival?.festivalName}
          </Title>

          {festival?.festivalStatus && (
            <Tag color={statusColor[festival.festivalStatus]}>
              {festival.festivalStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE BUTTONS */}
      <Col>
        <Space>
          {festival?.festivalStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveFestival}
              >
                Approve Festival
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleRejectFestival}
              >
                Reject Festival
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/festivals")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
