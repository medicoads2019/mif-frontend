import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBusinessFrameById,
  updateBusinessFrameName,
  updateBusinessFrameCoverImage,
  updateBusinessFrameStatus,
} from "../../api/businessFrameApi";

import { batchUploadImages } from "../../api/businessFrameImageApi";

import useBusinessFrameImages from "../../hooks/useBusinessFrameImages";

import BusinessFrameHeader from "../../components/businessFrame/BusinessFrameHeader";
import BusinessFrameForm from "../../components/businessFrame/BusinessFrameForm";
import BusinessFrameCoverImage from "../../components/businessFrame/BusinessFrameCoverImage";
import BusinessFrameImageGallery from "../../components/businessFrame/BusinessFrameImageGallery";
import DeletedImageGallery from "../../components/businessFrame/DeletedImageGallery";
import ImageDrawer from "../../components/businessFrame/ImageDrawer";

export default function EditBusinessFrame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [businessFrame, setBusinessFrame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverUploading, setCoverUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  /* ===============================
     IMAGE HOOK
  =============================== */

  const {
    activeImages,
    deletedImages,
    selectedImage,
    setSelectedImage,
    loadAllImages,
    approveImage,
    rejectImage,
    softDelete,
    restore,
    hardDelete,
  } = useBusinessFrameImages();

  /* ===============================
     LOAD BUSINESS FRAME
  =============================== */

  const loadBusinessFrame = async () => {
    try {
      setLoading(true);

      const res = await getBusinessFrameById(id);
      const data = res?.data?.data;

      setBusinessFrame(data);

      await loadAllImages(data?.businessFrameId || id);

      form.setFieldsValue({
        businessFrameName: data.businessFrameName,
        businessFrameCode: data.businessFrameCode,
        businessFrameStatus: data.businessFrameStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load business frame");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessFrame();
  }, [id]);

  /* ===============================
     UPDATE BUSINESS FRAME
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.businessFrameName !== businessFrame.businessFrameName) {
        await updateBusinessFrameName(id, values.businessFrameName);
      }

      if (values.businessFrameStatus !== businessFrame.businessFrameStatus) {
        await updateBusinessFrameStatus(id, values.businessFrameStatus);
      }

      message.success("Business frame updated successfully");

      loadBusinessFrame();
    } catch (error) {
      console.error(error);
      message.error("Update failed");
    }
  };

  /* ===============================
     COVER IMAGE
  =============================== */

  const handleCoverUpload = async (file) => {
    try {
      setCoverUploading(true);

      await updateBusinessFrameCoverImage(id, file);

      message.success("Cover image updated");

      loadBusinessFrame();
    } catch (error) {
      console.error(error);
      message.error("Cover image update failed");
    } finally {
      setCoverUploading(false);
    }

    return false;
  };

  /* ===============================
     BATCH IMAGE UPLOAD
  =============================== */

  const handleBatchUpload = async (files) => {
    try {
      setUploadingImages(true);

      const payload = {
        businessFrameId: id,
        createdBy: businessFrame?.createdBy || "admin",
        uploadedBy: businessFrame?.uploadedBy || "admin",
        files,
      };

      await batchUploadImages(payload);

      // Refresh only the image list so gallery updates without a full-page spinner
      await loadAllImages(id);
    } catch (error) {
      console.error(error);
      message.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  /* ===============================
     LOADING STATE
  =============================== */

  if (loading || !businessFrame) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "Business Frames" },
          { title: businessFrame?.businessFrameName },
        ]}
      />

      <BusinessFrameHeader
        businessFrame={businessFrame}
        navigate={navigate}
        reloadBusinessFrame={loadBusinessFrame}
      />

      <BusinessFrameForm
        form={form}
        onFinish={onFinish}
        businessFrame={businessFrame}
      />

      <BusinessFrameCoverImage
        businessFrame={businessFrame}
        handleCoverUpload={handleCoverUpload}
        coverUploading={coverUploading}
      />

      <BusinessFrameImageGallery
        images={activeImages}
        uploadingImages={uploadingImages}
        handleBatchUpload={handleBatchUpload}
        setSelectedImage={setSelectedImage}
      />

      <DeletedImageGallery
        images={deletedImages}
        setSelectedImage={setSelectedImage}
      />

      <ImageDrawer
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleApprove={(imgId) => approveImage(imgId, loadBusinessFrame)}
        handleReject={(imgId) => rejectImage(imgId, loadBusinessFrame)}
        handleSoftDelete={(imgId) => softDelete(imgId, loadBusinessFrame)}
        handleRestore={(imgId) => restore(imgId, loadBusinessFrame)}
        handleHardDelete={(imgId) => hardDelete(imgId, loadBusinessFrame)}
      />
    </Space>
  );
}
