import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/businessimages");

/* ======================================================
   🟢 BATCH UPLOAD IMAGES
   POST /businessimages/batch-upload
====================================================== */
export const batchUploadImages = (data) => {
  const formData = new FormData();

  formData.append("businessId", data.businessId);
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
   GET /businessimages/{id}
====================================================== */
export const getImageById = (id) => API.get(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY STATUS
   GET /businessimages/status/{status}
====================================================== */
export const getImagesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET IMAGES BY SOFT DELETE
   GET /businessimages/softdelete/{value}
====================================================== */
export const getImagesBySoftDelete = (value) => API.get(`/softdelete/${value}`);

/* ======================================================
   🔍 GET IMAGES BY USER TYPE ACCESS
   GET /businessimages/userTypeAccess/{userTypeAccess}
====================================================== */
export const getImagesByUserTypeAccess = (userTypeAccess) =>
  API.get(`/userTypeAccess/${userTypeAccess}`);

/* ======================================================
   🔍 GET IMAGES BY ORIENTATION
   GET /businessimages/orientation/{orientation}
====================================================== */
export const getImagesByOrientation = (orientation) =>
  API.get(`/orientation/${orientation}`);

/* ======================================================
   ↻ INCREMENT VIEW COUNT
   PATCH /businessimages/{id}/increment-view
====================================================== */
export const incrementImageView = (id) => API.patch(`/${id}/increment-view`);

/* ======================================================
   ↻ INCREMENT LIKE COUNT
   PATCH /businessimages/{id}/increment-like
====================================================== */
export const incrementImageLike = (id) => API.patch(`/${id}/increment-like`);

/* ======================================================
   ↻ INCREMENT DOWNLOAD COUNT
   PATCH /businessimages/{id}/increment-download
====================================================== */
export const incrementImageDownload = (id) =>
  API.patch(`/${id}/increment-download`);

/* ======================================================
   ↻ UPDATE USER TYPE ACCESS
   PATCH /businessimages/{id}/user-access/{userTypeAccess}
====================================================== */
export const updateImageUserAccess = (id, userTypeAccess) =>
  API.patch(`/${id}/user-access/${userTypeAccess}`);

/* ======================================================
   ↻ UPDATE IMAGE STATUS
   PATCH /businessimages/{id}/status/{status}
====================================================== */
export const updateImageStatus = (id, status) =>
  API.patch(`/${id}/status/${status}`);

/* ======================================================
   🗑 SOFT DELETE IMAGE
   PATCH /businessimages/{id}/soft-delete
====================================================== */
export const softDeleteImage = (id) => API.patch(`/${id}/soft-delete`);

/* ======================================================
   🔄 REORDER IMAGES
   PATCH /businessimages/reorder
====================================================== */
export const reorderImages = (data) => API.patch("/reorder", data);

/* ======================================================
   ♻ RESTORE IMAGE
   PATCH /businessimages/{id}/restore
====================================================== */
export const restoreImage = (id) => API.patch(`/${id}/restore`);

/* ======================================================
   ⛔ HARD DELETE IMAGE
   DELETE /businessimages/{id}
====================================================== */
export const hardDeleteImage = (id) => API.delete(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY BUSINESS
   GET /businessimages/business/{businessId}
====================================================== */
export const getImagesByBusiness = (businessId) =>
  API.get(`/business/${businessId}`);
