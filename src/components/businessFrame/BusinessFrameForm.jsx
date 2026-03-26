import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function BusinessFrameForm({ form, onFinish, businessFrame }) {
  return (
    <Card title="Business Frame Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Business Frame Name */}
          <Col span={12}>
            <Form.Item
              name="businessFrameName"
              label="Business Frame Name"
              rules={[
                { required: true, message: "Business frame name is required" },
              ]}
            >
              <Input placeholder="Enter business frame name" />
            </Form.Item>
          </Col>

          {/* Business Frame Code (auto-generated, read-only) */}
          <Col span={12}>
            <Form.Item name="businessFrameCode" label="Business Frame Code">
              <Input
                disabled
                style={{ color: "rgba(0,0,0,0.65)", background: "#f5f5f5" }}
              />
            </Form.Item>
          </Col>

          {/* Business Frame Status */}
          <Col span={12}>
            <Form.Item
              name="businessFrameStatus"
              label="Business Frame Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select
                placeholder="Select status"
                disabled={businessFrame?.businessFrameStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: 8 }}>
          <Button type="primary" htmlType="submit">
            Update Business Frame
          </Button>
        </div>
      </Form>
    </Card>
  );
}
