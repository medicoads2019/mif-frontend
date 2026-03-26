import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBusinessById,
  updateBusinessName,
  updateBusinessCoverImage,
  updateBusinessStatus,
} from "../../api/businessApi";

import { batchUploadImages } from "../../api/businessimageApi";

import useBusinessImages from "../../hooks/useBusinessImages";

import BusinessHeader from "../../components/business/BusinessHeader";
import BusinessForm from "../../components/business/BusinessForm";
import BusinessCoverImage from "../../components/business/BusinessCoverImage";
import BusinessImageGallery from "../../components/business/BusinessImageGallery";
import DeletedImageGallery from "../../components/business/DeletedImageGallery";
import ImageDrawer from "../../components/business/ImageDrawer";

export default function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [business, setBusiness] = useState(null);
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
  } = useBusinessImages();

  /* ===============================
     LOAD BUSINESS
  =============================== */

  const loadBusiness = async () => {
    try {
      setLoading(true);

      const res = await getBusinessById(id);
      const data = res?.data?.data;

      setBusiness(data);

      await loadAllImages(id);

      form.setFieldsValue({
        businessName: data.businessName,
        businessStatus: data.businessStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load business");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();
  }, [id]);

  /* ===============================
     UPDATE BUSINESS
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.businessName !== business.businessName) {
        await updateBusinessName(id, values.businessName);
      }

      if (values.businessStatus !== business.businessStatus) {
        await updateBusinessStatus(id, values.businessStatus);
      }

      message.success("Business updated successfully");

      loadBusiness();
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

      await updateBusinessCoverImage(id, file);

      message.success("Cover image updated");

      loadBusiness();
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
        businessId: id,
        createdBy: business?.createdBy || "admin",
        uploadedBy: business?.uploadedBy || "admin",
        files,
      };

      await batchUploadImages(payload);

      message.success("Images uploaded successfully");

      loadBusiness();
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

  if (loading) return <Spin />;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "Businesss" },
          { title: business?.businessName },
        ]}
      />

      <BusinessHeader
        business={business}
        navigate={navigate}
        reloadBusiness={loadBusiness}
      />

      <BusinessForm form={form} onFinish={onFinish} business={business} />

      <BusinessCoverImage
        business={business}
        handleCoverUpload={handleCoverUpload}
        coverUploading={coverUploading}
      />

      <BusinessImageGallery
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
        handleApprove={(imgId) => approveImage(imgId, loadBusiness)}
        handleReject={(imgId) => rejectImage(imgId, loadBusiness)}
        handleSoftDelete={(imgId) => softDelete(imgId, loadBusiness)}
        handleRestore={(imgId) => restore(imgId, loadBusiness)}
        handleHardDelete={(imgId) => hardDelete(imgId, loadBusiness)}
      />
    </Space>
  );
}
