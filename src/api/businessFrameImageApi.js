import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/business-frame-images");

/* ======================================================
   🟢 BATCH UPLOAD IMAGES
   POST /business-frame-images/batch-upload
====================================================== */
export const batchUploadImages = (data) => {
  const formData = new FormData();

  formData.append("businessFrameId", data.businessFrameId);
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
   GET /business-frame-images/{id}
====================================================== */
export const getImageById = (id) => API.get(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY STATUS
   GET /business-frame-images/status/{status}
====================================================== */
export const getImagesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET IMAGES BY SOFT DELETE
   GET /business-frame-images/softdelete/{value}
====================================================== */
export const getImagesBySoftDelete = (value) => API.get(`/softdelete/${value}`);

/* ======================================================
   🔍 GET IMAGES BY USER TYPE ACCESS
   GET /business-frame-images/userTypeAccess/{userTypeAccess}
====================================================== */
export const getImagesByUserTypeAccess = (userTypeAccess) =>
  API.get(`/userTypeAccess/${userTypeAccess}`);

/* ======================================================
   🔍 GET IMAGES BY ORIENTATION
   GET /business-frame-images/orientation/{orientation}
====================================================== */
export const getImagesByOrientation = (orientation) =>
  API.get(`/orientation/${orientation}`);

/* ======================================================
   ↻ UPDATE USER TYPE ACCESS
   PATCH /business-frame-images/{id}/user-access/{userTypeAccess}
====================================================== */
export const updateImageUserAccess = (id, userTypeAccess) =>
  API.patch(`/${id}/user-access/${userTypeAccess}`);

/* ======================================================
   ↻ UPDATE IMAGE STATUS
   PATCH /business-frame-images/{id}/status/{status}
====================================================== */
export const updateImageStatus = (id, status) =>
  API.patch(`/${id}/status/${status}`);

/* ======================================================
   🔄 REORDER IMAGES
   PATCH /business-frame-images/reorder
====================================================== */
export const reorderImages = (data) => API.patch("/reorder", data);

/* ======================================================
   🗑 SOFT DELETE IMAGE
   PATCH /business-frame-images/{id}/soft-delete
====================================================== */
export const softDeleteImage = (id) => API.patch(`/${id}/soft-delete`);

/* ======================================================
   ♻ RESTORE IMAGE
   PATCH /business-frame-images/{id}/restore
====================================================== */
export const restoreImage = (id) => API.patch(`/${id}/restore`);

/* ======================================================
   ⛔ HARD DELETE IMAGE
   DELETE /business-frame-images/{id}
====================================================== */
export const hardDeleteImage = (id) => API.delete(`/${id}`);

/* ======================================================
   🔍 GET IMAGES BY BUSINESS FRAME
   GET /business-frame-images/business-frame/{businessFrameId}
====================================================== */
export const getImagesByBusinessFrame = (businessFrameId) =>
  API.get(`/business-frame/${businessFrameId}`);
