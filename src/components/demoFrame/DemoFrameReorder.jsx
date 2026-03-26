import { Row, Col, Card, Image, message } from "antd";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { reorderDemoFrames } from "../../api/demoFrameApi";

function SortableDemoFrame({ demoFrame }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: demoFrame.demoFrameId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col span={6} ref={setNodeRef} style={style}>
      <Card {...attributes} {...listeners} hoverable style={{ cursor: "grab" }}>
        <Image
          src={demoFrame.thumbnailUrl}
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

export default function DemoFrameReorder({ demoFrames, setDemoFrames }) {
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = demoFrames.findIndex((b) => b.demoFrameId === active.id);

    const newIndex = demoFrames.findIndex((b) => b.demoFrameId === over.id);

    const newOrder = arrayMove(demoFrames, oldIndex, newIndex);

    setDemoFrames(newOrder);

    try {
      const payload = newOrder.map((demoFrame, index) => ({
        demoFrameId: demoFrame.demoFrameId,
        orderIndex: index,
      }));

      await reorderDemoFrames(payload);

      message.success("DemoFrame order updated");
    } catch {
      message.error("Failed to update demoFrame order");
    }
  };

  return (
    <Card title="Drag & Drop DemoFrame Order">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={demoFrames.map((b) => b.demoFrameId)}
          strategy={rectSortingStrategy}
        >
          <Row gutter={[12, 12]}>
            {demoFrames.map((demoFrame) => (
              <SortableDemoFrame
                key={demoFrame.demoFrameId}
                demoFrame={demoFrame}
              />
            ))}
          </Row>
        </SortableContext>
      </DndContext>
    </Card>
  );
}
