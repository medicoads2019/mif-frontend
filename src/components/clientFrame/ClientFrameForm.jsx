import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function ClientFrameForm({ form, onFinish, clientFrame }) {
  return (
    <Card title="Client Frame Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Client Frame Name */}
          <Col span={12}>
            <Form.Item
              name="clientFrameName"
              label="Client Frame Name"
              rules={[
                { required: true, message: "Client frame name is required" },
              ]}
            >
              <Input placeholder="Enter client frame name" />
            </Form.Item>
          </Col>

          {/* Client Frame Code (auto-generated, read-only) */}
          <Col span={12}>
            <Form.Item name="clientFrameCode" label="Client Frame Code">
              <Input
                disabled
                style={{ color: "rgba(0,0,0,0.65)", background: "#f5f5f5" }}
              />
            </Form.Item>
          </Col>

          {/* Client Frame Status */}
          <Col span={12}>
            <Form.Item
              name="clientFrameStatus"
              label="Client Frame Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select
                placeholder="Select status"
                disabled={clientFrame?.clientFrameStatus === "DELETED"}
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
            Update Client Frame
          </Button>
        </div>
      </Form>
    </Card>
  );
}
