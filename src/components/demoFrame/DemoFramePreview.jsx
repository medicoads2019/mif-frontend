import { Card, Image, Empty, Tag, Typography, Row, Col } from "antd";

const { Text } = Typography;

export default function DemoFramePreview({ demoFrames }) {
  const carouselDemoFrames = demoFrames.filter((b) => b.showInCarousel);

  return (
    <Card
      title="Homepage DemoFrame Preview"
      style={{ borderRadius: 10 }}
      bodyStyle={{ padding: 16 }}
    >
      {carouselDemoFrames.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <Empty description="No demoFrames enabled for carousel" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {carouselDemoFrames.map((demoFrame) => (
            <Col key={demoFrame.demoFrameId} xs={24} sm={12} md={8} lg={6}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1", // makes square
                  overflow: "hidden",
                  borderRadius: 8,
                }}
              >
                {/* Image */}
                <Image
                  src={demoFrame.thumbnailUrl}
                  // preview={false}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                  }}
                />

                {/* Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "8px 10px",
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.65))",
                    color: "#fff",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 14 }}>
                    {demoFrame.demoFrameName}
                  </Text>

                  <div style={{ marginTop: 2 }}>
                    <Tag color="green">Carousel</Tag>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
}
