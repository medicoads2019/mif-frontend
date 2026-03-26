import { Card, Form, Input, DatePicker, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function FestivalForm({ form, onFinish, festival }) {
  return (
    <Card title="Festival Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Festival Name */}
          <Col span={8}>
            <Form.Item
              name="festivalName"
              label="Festival Name"
              rules={[{ required: true, message: "Festival name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Festival Date */}
          <Col span={8}>
            <Form.Item
              name="festivalDate"
              label="Festival Date"
              rules={[{ required: true, message: "Festival date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          {/* Festival Status */}
          <Col span={8}>
            <Form.Item
              name="festivalStatus"
              label="Festival Status"
              rules={[
                { required: true, message: "Festival status is required" },
              ]}
            >
              <Select
                placeholder="Select status"
                disabled={festival?.festivalStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Update Festival
        </Button>
      </Form>
    </Card>
  );
}
