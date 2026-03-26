/**
 * =========================================
 * IMAGE HELPERS
 * Utility functions for image operations
 * =========================================
 */

/* ===============================
   SPLIT IMAGES
   Active vs Deleted
================================ */

export const splitImagesBySoftDelete = (images = []) => {
  const activeImages = images.filter((img) => img.softDelete !== true);
  const deletedImages = images.filter((img) => img.softDelete === true);

  return { activeImages, deletedImages };
};

/* ===============================
   FORMAT IMAGE DATA
   Prevent null/undefined issues
================================ */

export const normalizeImage = (image) => {
  return {
    ...image,
    softDelete: image?.softDelete ?? false,
    status: image?.status ?? "PENDING",
    viewCount: image?.viewCount ?? 0,
    likeCount: image?.likeCount ?? 0,
    downloadCount: image?.downloadCount ?? 0,
  };
};

/* ===============================
   NORMALIZE IMAGE ARRAY
================================ */

export const normalizeImages = (images = []) => {
  return images.map(normalizeImage);
};

/* ===============================
   GET IMAGE STATUS COLOR
================================ */

export const getImageStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "green";

    case "REJECTED":
      return "red";

    case "PENDING":
      return "blue";

    default:
      return "default";
  }
};

/* ===============================
   FORMAT IMAGE URL (fallback)
================================ */

export const getImageUrl = (image) => {
  return image?.imageUrl || image?.thumbnailUrl || "";
};
