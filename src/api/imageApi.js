import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/festivalimages");

/* ======================================================
   🟢 BATCH UPLOAD IMAGES
   POST /festivalimages/batch-upload
====================================================== */
export const batchUploadImages = (data) => {
  const formData = new FormData();

  formData.append("festivalId", data.festivalId);
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
   GET /festivalimages/{id}
====================================================== */
export const getImageById = (id) => API.get(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY STATUS
   GET /festivalimages/status/{status}
====================================================== */
export const getImagesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET IMAGES BY SOFT DELETE
   GET /festivalimages/softdelete/{value}
====================================================== */
export const getImagesBySoftDelete = (value) => API.get(`/softdelete/${value}`);

/* ======================================================
   🔍 GET IMAGES BY USER TYPE ACCESS
   GET /festivalimages/userTypeAccess/{userTypeAccess}
====================================================== */
export const getImagesByUserTypeAccess = (userTypeAccess) =>
  API.get(`/userTypeAccess/${userTypeAccess}`);

/* ======================================================
   🔍 GET IMAGES BY ORIENTATION
   GET /festivalimages/orientation/{orientation}
====================================================== */
export const getImagesByOrientation = (orientation) =>
  API.get(`/orientation/${orientation}`);

/* ======================================================
   ↻ INCREMENT VIEW COUNT
   PATCH /festivalimages/{id}/increment-view
====================================================== */
export const incrementImageView = (id) => API.patch(`/${id}/increment-view`);

/* ======================================================
   ↻ INCREMENT LIKE COUNT
   PATCH /festivalimages/{id}/increment-like
====================================================== */
export const incrementImageLike = (id) => API.patch(`/${id}/increment-like`);

/* ======================================================
   ↻ INCREMENT DOWNLOAD COUNT
   PATCH /festivalimages/{id}/increment-download
====================================================== */
export const incrementImageDownload = (id) =>
  API.patch(`/${id}/increment-download`);

/* ======================================================
   ↻ UPDATE USER TYPE ACCESS
   PATCH /festivalimages/{id}/user-access/{userTypeAccess}
====================================================== */
export const updateImageUserAccess = (id, userTypeAccess) =>
  API.patch(`/${id}/user-access/${userTypeAccess}`);

/* ======================================================
   ↻ UPDATE IMAGE STATUS
   PATCH /festivalimages/{id}/status/{status}
====================================================== */
export const updateImageStatus = (id, status) =>
  API.patch(`/${id}/status/${status}`);

/* ======================================================
   🗑 SOFT DELETE IMAGE
   PATCH /festivalimages/{id}/soft-delete
====================================================== */
export const softDeleteImage = (id) => API.patch(`/${id}/soft-delete`);

/* ======================================================
   🔄 REORDER IMAGES
   PATCH /festivalimages/reorder
====================================================== */
export const reorderImages = (data) => API.patch("/reorder", data);

/* ======================================================
   ♻ RESTORE IMAGE
   PATCH /festivalimages/{id}/restore
====================================================== */
export const restoreImage = (id) => API.patch(`/${id}/restore`);

/* ======================================================
   ⛔ HARD DELETE IMAGE
   DELETE /festivalimages/{id}
====================================================== */
export const hardDeleteImage = (id) => API.delete(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY FESTIVAL
   GET /festivalimages/festival/{festivalId}
====================================================== */
export const getImagesByFestival = (festivalId) =>
  API.get(`/festival/${festivalId}`);
