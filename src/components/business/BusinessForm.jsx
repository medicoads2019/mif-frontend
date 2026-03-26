import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function BusinessForm({ form, onFinish, business }) {
  return (
    <Card title="Business Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Business Name */}
          <Col span={12}>
            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[{ required: true, message: "Business name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Business Status */}
          <Col span={12}>
            <Form.Item
              name="businessStatus"
              label="Business Status"
              rules={[
                { required: true, message: "Business status is required" },
              ]}
            >
              <Select
                placeholder="Select status"
                disabled={business?.businessStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Update Business
        </Button>
      </Form>
    </Card>
  );
}
