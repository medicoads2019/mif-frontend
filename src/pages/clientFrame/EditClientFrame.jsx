import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getClientFrameById,
  updateClientFrameName,
  updateClientFrameCoverImage,
  updateClientFrameStatus,
} from "../../api/clientFrameApi";

import { batchUploadImages } from "../../api/clientFrameImageApi";

import useClientFrameImages from "../../hooks/useClientFrameImages";

import ClientFrameHeader from "../../components/clientFrame/ClientFrameHeader";
import ClientFrameForm from "../../components/clientFrame/ClientFrameForm";
import ClientFrameCoverImage from "../../components/clientFrame/ClientFrameCoverImage";
import ClientFrameImageGallery from "../../components/clientFrame/ClientFrameImageGallery";
import DeletedImageGallery from "../../components/clientFrame/DeletedImageGallery";
import ImageDrawer from "../../components/clientFrame/ImageDrawer";

export default function EditClientFrame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [clientFrame, setClientFrame] = useState(null);
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
  } = useClientFrameImages();

  /* ===============================
     LOAD CLIENT FRAME
  =============================== */

  const loadClientFrame = async () => {
    try {
      setLoading(true);

      const res = await getClientFrameById(id);
      const data = res?.data?.data;

      setClientFrame(data);

      await loadAllImages(data?.clientFrameId || id);

      form.setFieldsValue({
        clientFrameName: data.clientFrameName,
        clientFrameCode: data.clientFrameCode,
        clientFrameStatus: data.clientFrameStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load client frame");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ===============================
     UPDATE CLIENT FRAME
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.clientFrameName !== clientFrame.clientFrameName) {
        await updateClientFrameName(id, values.clientFrameName);
      }

      if (values.clientFrameStatus !== clientFrame.clientFrameStatus) {
        await updateClientFrameStatus(id, values.clientFrameStatus);
      }

      message.success("Client frame updated successfully");

      loadClientFrame();
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

      await updateClientFrameCoverImage(id, file);

      message.success("Cover image updated");

      loadClientFrame();
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
        clientFrameId: id,
        createdBy: clientFrame?.createdBy || "admin",
        uploadedBy: clientFrame?.uploadedBy || "admin",
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

  if (loading || !clientFrame) {
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
          { title: "Client Frames" },
          { title: clientFrame?.clientFrameName },
        ]}
      />

      <ClientFrameHeader
        clientFrame={clientFrame}
        navigate={navigate}
        reloadClientFrame={loadClientFrame}
      />

      <ClientFrameForm
        form={form}
        onFinish={onFinish}
        clientFrame={clientFrame}
      />

      <ClientFrameCoverImage
        clientFrame={clientFrame}
        handleCoverUpload={handleCoverUpload}
        coverUploading={coverUploading}
      />

      <ClientFrameImageGallery
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
        handleApprove={(imgId) => approveImage(imgId, loadClientFrame)}
        handleReject={(imgId) => rejectImage(imgId, loadClientFrame)}
        handleSoftDelete={(imgId) => softDelete(imgId, loadClientFrame)}
        handleRestore={(imgId) => restore(imgId, loadClientFrame)}
        handleHardDelete={(imgId) => hardDelete(imgId, loadClientFrame)}
      />
    </Space>
  );
}
