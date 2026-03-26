import { Row, Col, Card, Image, message } from "antd";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { reorderBanners } from "../../api/bannerApi";

function SortableBanner({ banner }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: banner.bannerId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col span={6} ref={setNodeRef} style={style}>
      <Card {...attributes} {...listeners} hoverable style={{ cursor: "grab" }}>
        <Image
          src={banner.thumbnailUrl}
          preview={false}
          style={{
            width: "100%",
            height: 80,
            objectFit: "cover",
          }}
        />
      </Card>
    </Col>
  );
}

export default function BannerReorder({ banners, setBanners }) {
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.bannerId === active.id);

    const newIndex = banners.findIndex((b) => b.bannerId === over.id);

    const newOrder = arrayMove(banners, oldIndex, newIndex);

    setBanners(newOrder);

    try {
      const payload = newOrder.map((banner, index) => ({
        bannerId: banner.bannerId,
        orderIndex: index,
      }));

      await reorderBanners(payload);

      message.success("Banner order updated");
    } catch {
      message.error("Failed to update banner order");
    }
  };

  return (
    <Card title="Drag & Drop Banner Order">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={banners.map((b) => b.bannerId)}
          strategy={rectSortingStrategy}
        >
          <Row gutter={[12, 12]}>
            {banners.map((banner) => (
              <SortableBanner key={banner.bannerId} banner={banner} />
            ))}
          </Row>
        </SortableContext>
      </DndContext>
    </Card>
  );
}
