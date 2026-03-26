import { Carousel, Card, Image, Empty, Tag, Typography } from "antd";

const { Text } = Typography;

export default function BannerPreview({ banners }) {
  const carouselBanners = banners.filter(
    (b) => b.showInCarousel && b.bannerStatus === "APPROVED",
  );

  return (
    <Card
      title="Homepage Banner Preview"
      style={{
        borderRadius: 10,
      }}
      bodyStyle={{ padding: 0 }}
    >
      {carouselBanners.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
          }}
        >
          <Empty description="No banners enabled for carousel" />
        </div>
      ) : (
        <Carousel autoplay dotPosition="bottom">
          {carouselBanners.map((banner) => (
            <div key={banner.bannerId}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 260,
                  overflow: "hidden",
                  borderRadius: 8,
                }}
              >
                {/* Banner Image */}
                <Image
                  src={banner.thumbnailUrl}
                  preview={false}
                  width="100%"
                  height={260}
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
                    padding: "12px 16px",
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.65))",
                    color: "#fff",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    {banner.bannerName}
                  </Text>

                  <div style={{ marginTop: 4 }}>
                    <Tag color="green">Carousel Enabled</Tag>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </Card>
  );
}
