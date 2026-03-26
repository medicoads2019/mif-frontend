import { Breadcrumb, Typography, Space } from "antd";

const { Title } = Typography;

const PageHeader = ({ title, breadcrumb = [], extra }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        {breadcrumb.map((item, index) => (
          <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>

      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>

        {extra}
      </Space>
    </div>
  );
};

export default PageHeader;
