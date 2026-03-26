import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function BannerForm({ form, onFinish, banner }) {
  return (
    <Card title="Banner Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Banner Name */}
          <Col span={12}>
            <Form.Item
              name="bannerName"
              label="Banner Name"
              rules={[{ required: true, message: "Banner name is required" }]}
            >
              <Input placeholder="Enter banner name" />
            </Form.Item>
          </Col>

          {/* Banner Status */}
          <Col span={12}>
            <Form.Item name="bannerStatus" label="Banner Status">
              <Select
                placeholder="Select status"
                disabled={banner?.bannerStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Update Banner
        </Button>
      </Form>
    </Card>
  );
}
