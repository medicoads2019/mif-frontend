import { useState } from "react";
import { message } from "antd";

import {
  getImagesByFestival,
  updateImageStatus,
  softDeleteImage,
  restoreImage,
  hardDeleteImage,
} from "../api/imageApi";

export default function useFestivalImages() {
  const [activeImages, setActiveImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  /* ===============================
     LOAD IMAGES BY FESTIVAL
  =============================== */

  const loadAllImages = async (festivalId) => {
    try {
      if (!festivalId) {
        setActiveImages([]);
        setDeletedImages([]);
        return;
      }

      const res = await getImagesByFestival(festivalId);

      setActiveImages(res?.data?.activeImages || []);
      setDeletedImages(res?.data?.deletedImages || []);
    } catch (error) {
      console.error(error);
      message.error("Failed to load images");
    }
  };

  /* ===============================
     APPROVE IMAGE
  =============================== */

  const approveImage = async (imgId, reload) => {
    try {
      await updateImageStatus(imgId, "APPROVED");

      message.success("Image approved");

      if (reload) reload();
    } catch (error) {
      message.error("Approve failed");
    }
  };

  /* ===============================
     REJECT IMAGE
  =============================== */

  const rejectImage = async (imgId, reload) => {
    try {
      await updateImageStatus(imgId, "REJECTED");

      message.success("Image rejected");

      if (reload) reload();
    } catch (error) {
      message.error("Reject failed");
    }
  };

  /* ===============================
     SOFT DELETE
  =============================== */

  const softDelete = async (imgId, reload) => {
    try {
      await softDeleteImage(imgId);

      message.success("Image soft deleted");

      setSelectedImage(null);

      if (reload) reload();
    } catch (error) {
      message.error("Soft delete failed");
    }
  };

  /* ===============================
     RESTORE IMAGE
  =============================== */

  const restore = async (imgId, reload) => {
    try {
      await restoreImage(imgId);

      message.success("Image restored");

      setSelectedImage(null);

      if (reload) reload();
    } catch (error) {
      message.error("Restore failed");
    }
  };

  /* ===============================
     HARD DELETE
  =============================== */

  const hardDelete = async (imgId) => {
    try {
      await hardDeleteImage(imgId);

      message.success("Image permanently deleted");

      setSelectedImage(null);

      // remove instantly from UI
      setDeletedImages((prev) => prev.filter((img) => img.id !== imgId));
    } catch (error) {
      message.error("Hard delete failed");
    }
  };

  return {
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
  };
}
