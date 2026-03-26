import { Card, Row, Col, Upload, Button, Image, Progress, message } from "antd";

import { UploadOutlined, HolderOutlined } from "@ant-design/icons";

import { useState, useEffect } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { reorderImages } from "../../api/clientFrameImageApi";

import { CSS } from "@dnd-kit/utilities";

/* ===============================
   SORTABLE IMAGE ITEM
=============================== */

function SortableImage({ img, setSelectedImage }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col xs={12} sm={8} md={6} lg={4} ref={setNodeRef} style={style}>
      <div
        style={{
          position: "relative",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {/* Drag Handle */}

        <div
          {...attributes}
          {...listeners}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 4,
            padding: "2px 6px",
            cursor: "grab",
            color: "#fff",
            zIndex: 5,
          }}
        >
          <HolderOutlined />
        </div>

        {/* Image */}

        {img.thumbnailUrl ? (
          <img
            loading="lazy"
            src={img.thumbnailUrl}
            alt="client-frame"
            onClick={() => setSelectedImage(img)}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        ) : (
          <div
            onClick={() => setSelectedImage(img)}
            style={{
              width: "100%",
              height: 180,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
              color: "#999",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span>⏳</span>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </Col>
  );
}

/* ===============================
   MAIN COMPONENT
=============================== */

export default function ClientFrameImageGallery({
  images,
  handleBatchUpload,
  uploadingImages,
  setSelectedImage,
}) {
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  /* Sync gallery when images update */

  useEffect(() => {
    setGalleryImages(images);
  }, [images]);

  /* ===============================
     HANDLE FILE CHANGE
  =============================== */

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  /* ===============================
     PREVIEW BEFORE UPLOAD
  =============================== */

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }

    setPreview(file.url || file.preview);
  };

  /* ===============================
     UPLOAD IMAGES
  =============================== */

  const uploadImages = async () => {
    if (!fileList.length) {
      message.warning("Please select images first");
      return;
    }

    try {
      const files = fileList.map((f) => f.originFileObj);

      const progressFiles = fileList.map((f) => ({
        ...f,
        percent: 50,
      }));

      setFileList(progressFiles);

      await handleBatchUpload(files);

      const completed = progressFiles.map((f) => ({
        ...f,
        percent: 100,
      }));

      setFileList(completed);

      message.success("Images uploaded successfully");

      setTimeout(() => setFileList([]), 1200);
    } catch (error) {
      message.error("Upload failed");
    }
  };

  /* ===============================
     DRAG REORDER
  =============================== */

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = galleryImages.findIndex((i) => i.id === active.id);
    const newIndex = galleryImages.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(galleryImages, oldIndex, newIndex);

    setGalleryImages(newOrder);

    try {
      const payload = newOrder.map((img, index) => ({
        imageId: img.id,
        orderIndex: index,
      }));

      await reorderImages(payload);
    } catch (error) {
      message.error("Failed to save image order");
    }
  };

  return (
    <Card
      title="Active Client Frame Images"
      extra={
        <div style={{ display: "flex", gap: 12 }}>
          <Upload
            multiple
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Select Images</Button>
          </Upload>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={uploadingImages}
            onClick={uploadImages}
            disabled={!fileList.length}
          >
            Upload
          </Button>
        </div>
      }
    >
      {/* Selected Images Preview */}

      {fileList.length > 0 && (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
            {fileList.map((file) => {
              const url =
                file.thumbUrl || URL.createObjectURL(file.originFileObj);

              return (
                <Col key={file.uid}>
                  <Image
                    width={100}
                    height={100}
                    src={url}
                    style={{
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                    preview
                  />
                </Col>
              );
            })}
          </Row>

          {fileList.map((file) => (
            <Progress
              key={file.uid}
              percent={file.percent || 0}
              style={{ marginBottom: 10 }}
            />
          ))}
        </>
      )}

      {/* Lightbox Preview */}

      {preview && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: !!preview,
            src: preview,
            onVisibleChange: (visible) => !visible && setPreview(null),
          }}
        />
      )}

      {/* Gallery */}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={galleryImages.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <Row gutter={[12, 12]}>
            {galleryImages.map((img) => (
              <SortableImage
                key={img.id}
                img={img}
                setSelectedImage={setSelectedImage}
              />
            ))}
          </Row>
        </SortableContext>
      </DndContext>
    </Card>
  );
}
