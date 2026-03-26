import { Card, Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

/**
 * =========================================
 * ⭐ DemoFrameFilter Component
 * =========================================
 *
 * Props:
 *  - filters
 *  - onFilterChange(type, value)
 *  - onReset()
 *
 */
const DemoFrameFilter = ({ filters, onFilterChange, onReset }) => {
  /**
   * ⭐ Detect if any filter applied
   */
  const hasFilters = Object.values(filters || {}).some(
    (v) => v !== undefined && v !== null,
  );

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space wrap>
        {/* ⭐ Status Filter */}
        <Select
          placeholder="Filter by Status"
          allowClear
          style={{ width: 180 }}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
        >
          <Option value="PENDING">PENDING</Option>
          <Option value="APPROVED">APPROVED</Option>
          <Option value="REJECTED">REJECTED</Option>
        </Select>

        {/* ⭐ Active / Deleted */}
        <Select
          placeholder="Active / Deleted"
          allowClear
          style={{ width: 180 }}
          value={filters?.lifecycle}
          onChange={(value) => onFilterChange("lifecycle", value)}
        >
          <Option value="active">Active</Option>
          <Option value="deleted">Deleted</Option>
        </Select>

        {/* ⭐ Carousel */}
        <Select
          placeholder="Carousel"
          allowClear
          style={{ width: 160 }}
          value={filters?.carousel}
          onChange={(value) => onFilterChange("carousel", value)}
        >
          <Option value={true}>In Carousel</Option>
          <Option value={false}>Not in Carousel</Option>
        </Select>

        {/* ⭐ Publish */}
        <Select
          placeholder="Publish"
          allowClear
          style={{ width: 160 }}
          value={filters?.publish}
          onChange={(value) => onFilterChange("publish", value)}
        >
          <Option value="published">Published</Option>
          <Option value="notPublished">Not Published</Option>
        </Select>

        {/* ⭐ Reset */}
        <Button
          icon={<ReloadOutlined />}
          onClick={onReset}
          disabled={!hasFilters}
        >
          Reset
        </Button>
      </Space>
    </Card>
  );
};

export default DemoFrameFilter;
