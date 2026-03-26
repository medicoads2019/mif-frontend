import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  getFestivalById,
  updateFestivalName,
  updateFestivalDate,
  updateFestivalCoverImage,
  updateFestivalStatus,
} from "../../api/festivalApi";

import { batchUploadImages } from "../../api/imageApi";

import useFestivalImages from "../../hooks/useFestivalImages";

import FestivalHeader from "../../components/festival/FestivalHeader";
import FestivalForm from "../../components/festival/FestivalForm";
import FestivalCoverImage from "../../components/festival/FestivalCoverImage";
import FestivalImageGallery from "../../components/festival/FestivalImageGallery";
import DeletedImageGallery from "../../components/festival/DeletedImageGallery";
import ImageDrawer from "../../components/festival/ImageDrawer";

export default function EditFestival() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [festival, setFestival] = useState(null);
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
  } = useFestivalImages();

  /* ===============================
     LOAD FESTIVAL
  =============================== */

  const loadFestival = async () => {
    try {
      setLoading(true);

      const res = await getFestivalById(id);
      const data = res?.data?.data;

      setFestival(data);

      if (data?.imageIds?.length) {
        await loadAllImages(id);
      }

      form.setFieldsValue({
        festivalName: data.festivalName,
        festivalDate: data.festivalDate ? dayjs(data.festivalDate) : null,
        festivalStatus: data.festivalStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load festival");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFestival();
  }, []);

  /* ===============================
     UPDATE FESTIVAL
  =============================== */

  const onFinish = async (values) => {
    try {
      const rawDate = values.festivalDate;
      const formattedDate = rawDate
        ? typeof rawDate.format === "function"
          ? rawDate.format("DD-MM-YYYY")
          : dayjs(rawDate).format("DD-MM-YYYY")
        : null;

      if (values.festivalName !== festival.festivalName) {
        await updateFestivalName(id, values.festivalName);
      }

      /* normalize existing date — use local timezone (same as DatePicker) */
      const existingDate = festival.festivalDate
        ? dayjs(festival.festivalDate).format("DD-MM-YYYY")
        : null;

      if (formattedDate && formattedDate !== existingDate) {
        await updateFestivalDate(id, formattedDate);
      }
      if (values.festivalStatus !== festival.festivalStatus) {
        await updateFestivalStatus(id, values.festivalStatus);
      }

      message.success("Festival updated successfully");

      loadFestival();
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error.message);
      message.error(error?.response?.data?.message || "Update failed");
    }
  };

  /* ===============================
     COVER IMAGE
  =============================== */

  const handleCoverUpload = async (file) => {
    try {
      setCoverUploading(true);

      await updateFestivalCoverImage(id, file);

      message.success("Cover image updated");

      loadFestival();
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
        festivalId: id,
        createdBy: festival?.createdBy || "admin",
        uploadedBy: festival?.uploadedBy || "admin",
        files,
      };

      await batchUploadImages(payload);

      message.success("Images uploaded successfully");

      loadFestival();
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
          { title: "Festivals" },
          { title: festival?.festivalName },
        ]}
      />

      <FestivalHeader
        festival={festival}
        navigate={navigate}
        reloadFestival={loadFestival}
      />

      <FestivalForm form={form} onFinish={onFinish} festival={festival} />

      <FestivalCoverImage
        festival={festival}
        handleCoverUpload={handleCoverUpload}
        coverUploading={coverUploading}
      />

      <FestivalImageGallery
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
        handleApprove={(id) => approveImage(id, loadFestival)}
        handleReject={(id) => rejectImage(id, loadFestival)}
        handleSoftDelete={(id) => softDelete(id, loadFestival)}
        handleRestore={(id) => restore(id, loadFestival)}
        handleHardDelete={(id) => hardDelete(id, loadFestival)}
      />
    </Space>
  );
}
