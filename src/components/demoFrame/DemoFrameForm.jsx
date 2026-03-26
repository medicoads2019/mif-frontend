import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function DemoFrameForm({ form, onFinish, demoFrame }) {
  return (
    <Card title="DemoFrame Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* DemoFrame Name */}
          <Col span={12}>
            <Form.Item
              name="demoFrameName"
              label="DemoFrame Name"
              rules={[
                { required: true, message: "DemoFrame name is required" },
              ]}
            >
              <Input placeholder="Enter demoFrame name" />
            </Form.Item>
          </Col>

          {/* DemoFrame Status */}
          <Col span={12}>
            <Form.Item name="demoFrameStatus" label="DemoFrame Status">
              <Select
                placeholder="Select status"
                disabled={demoFrame?.demoFrameStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Update DemoFrame
        </Button>
      </Form>
    </Card>
  );
}
