import { Card, Form, Input, Row, Col, Button, Select } from "antd";

const { Option } = Select;

export default function CategoryForm({ form, onFinish, category }) {
  return (
    <Card title="Category Details">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Category Name */}
          <Col span={12}>
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[{ required: true, message: "Category name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Category Status */}
          <Col span={12}>
            <Form.Item
              name="categoryStatus"
              label="Category Status"
              rules={[
                { required: true, message: "Category status is required" },
              ]}
            >
              <Select
                placeholder="Select status"
                disabled={category?.categoryStatus === "DELETED"}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="REJECTED">REJECTED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Update Category
        </Button>
      </Form>
    </Card>
  );
}
