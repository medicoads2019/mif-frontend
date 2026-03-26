import { Card, Row, Col } from "antd";

export default function DeletedImageGallery({ images, setSelectedImage }) {
  return (
    <Card title="Deleted Images (Soft Deleted)">
      <Row gutter={[12, 12]}>
        {images.map((img) => (
          <Col xs={12} sm={8} md={6} lg={4} key={img.id}>
            <img
              src={img.thumbnailUrl}
              alt="festival"
              onClick={() =>
                setSelectedImage({
                  ...img,
                  softDelete: true,
                })
              }
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 6,
                cursor: "pointer",
                opacity: 0.5,
              }}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
