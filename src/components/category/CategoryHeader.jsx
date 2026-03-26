import { Row, Col, Button, Space, Tag, Typography, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { updateCategoryStatus } from "../../api/categoryApi";

const { Title } = Typography;

export default function CategoryHeader({ category, navigate, reloadCategory }) {
  /* ===============================
     APPROVE CATEGORY
  =============================== */

  const handleApproveCategory = async () => {
    try {
      await updateCategoryStatus(category.categoryId, "APPROVED");

      message.success("Category approved successfully");

      reloadCategory?.();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT CATEGORY
  =============================== */

  const handleRejectCategory = async () => {
    try {
      await updateCategoryStatus(category.categoryId, "REJECTED");

      message.success("Category rejected successfully");

      reloadCategory?.();
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
            onClick={() => navigate("/categorys")}
          />

          <Title level={4} style={{ margin: 0 }}>
            {category?.categoryName}
          </Title>

          {category?.categoryStatus && (
            <Tag color={statusColor[category.categoryStatus]}>
              {category.categoryStatus}
            </Tag>
          )}
        </Space>
      </Col>

      {/* RIGHT SIDE BUTTONS */}
      <Col>
        <Space>
          {category?.categoryStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveCategory}
              >
                Approve Category
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleRejectCategory}
              >
                Reject Category
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/categorys")}>Back</Button>
        </Space>
      </Col>
    </Row>
  );
}
