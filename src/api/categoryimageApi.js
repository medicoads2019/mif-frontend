import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/categoryimages");

/* ======================================================
   🟢 BATCH UPLOAD IMAGES
   POST /categoryimages/batch-upload
====================================================== */
export const batchUploadImages = (data) => {
  const formData = new FormData();

  formData.append("categoryId", data.categoryId);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);

  data.files.forEach((file) => {
    formData.append("files", file);
  });

  return API.post("/batch-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET IMAGE BY ID
   GET /categoryimages/{id}
====================================================== */
export const getImageById = (id) => API.get(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY STATUS
   GET /categoryimages/status/{status}
====================================================== */
export const getImagesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET IMAGES BY SOFT DELETE
   GET /categoryimages/softdelete/{value}
====================================================== */
export const getImagesBySoftDelete = (value) => API.get(`/softdelete/${value}`);

/* ======================================================
   🔍 GET IMAGES BY USER TYPE ACCESS
   GET /categoryimages/userTypeAccess/{userTypeAccess}
====================================================== */
export const getImagesByUserTypeAccess = (userTypeAccess) =>
  API.get(`/userTypeAccess/${userTypeAccess}`);

/* ======================================================
   🔍 GET IMAGES BY ORIENTATION
   GET /categoryimages/orientation/{orientation}
====================================================== */
export const getImagesByOrientation = (orientation) =>
  API.get(`/orientation/${orientation}`);

/* ======================================================
   ↻ INCREMENT VIEW COUNT
   PATCH /categoryimages/{id}/increment-view
====================================================== */
export const incrementImageView = (id) => API.patch(`/${id}/increment-view`);

/* ======================================================
   ↻ INCREMENT LIKE COUNT
   PATCH /categoryimages/{id}/increment-like
====================================================== */
export const incrementImageLike = (id) => API.patch(`/${id}/increment-like`);

/* ======================================================
   ↻ INCREMENT DOWNLOAD COUNT
   PATCH /categoryimages/{id}/increment-download
====================================================== */
export const incrementImageDownload = (id) =>
  API.patch(`/${id}/increment-download`);

/* ======================================================
   ↻ UPDATE USER TYPE ACCESS
   PATCH /categoryimages/{id}/user-access/{userTypeAccess}
====================================================== */
export const updateImageUserAccess = (id, userTypeAccess) =>
  API.patch(`/${id}/user-access/${userTypeAccess}`);

/* ======================================================
   ↻ UPDATE IMAGE STATUS
   PATCH /categoryimages/{id}/status/{status}
====================================================== */
export const updateImageStatus = (id, status) =>
  API.patch(`/${id}/status/${status}`);

/* ======================================================
   🗑 SOFT DELETE IMAGE
   PATCH /categoryimages/{id}/soft-delete
====================================================== */
export const softDeleteImage = (id) => API.patch(`/${id}/soft-delete`);

/* ======================================================
   🔄 REORDER IMAGES
   PATCH /categoryimages/reorder
====================================================== */
export const reorderImages = (data) => API.patch("/reorder", data);

/* ======================================================
   ♻ RESTORE IMAGE
   PATCH /categoryimages/{id}/restore
====================================================== */
export const restoreImage = (id) => API.patch(`/${id}/restore`);

/* ======================================================
   ⛔ HARD DELETE IMAGE
   DELETE /categoryimages/{id}
====================================================== */
export const hardDeleteImage = (id) => API.delete(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY CATEGORY
   GET /categoryimages/category/{categoryId}
====================================================== */
export const getImagesByCategory = (categoryId) =>
  API.get(`/category/${categoryId}`);
