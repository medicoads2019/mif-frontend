import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/business-frames");

/* ======================================================
   🟢 CREATE BUSINESS FRAME
   POST /business-frames/create
====================================================== */
export const createBusinessFrame = (data) => {
  const formData = new FormData();

  formData.append("businessFrameName", data.businessFrameName);
  if (data.businessFrameCode)
    formData.append("businessFrameCode", data.businessFrameCode);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("coverImage", data.coverImage);

  return API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL BUSINESS FRAMES
   GET /business-frames/all
====================================================== */
export const getAllBusinessFrames = () => API.get("/all");

/* ======================================================
   🔍 GET BUSINESS FRAME BY ID
   GET /business-frames/{businessFrameId}
====================================================== */
export const getBusinessFrameById = (businessFrameId) =>
  API.get(`/${businessFrameId}`);

/* ======================================================
   🔍 GET BUSINESS FRAMES BY STATUS
   GET /business-frames/status/{status}
====================================================== */
export const getBusinessFramesByStatus = (status) =>
  API.get(`/status/${status}`);

/* ======================================================
   🔍 GET BUSINESS FRAMES BY SOFT DELETE
   GET /business-frames/soft-delete/{value}
====================================================== */
export const getBusinessFramesBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED BUSINESS FRAMES
   GET /business-frames/published
====================================================== */
export const getPublishedBusinessFrames = () => API.get("/published");

/* ======================================================
   🔍 GET BUSINESS FRAME BY CODE
   GET /business-frames/code/{code}
====================================================== */
export const getBusinessFrameByCode = (code) => API.get(`/code/${code}`);

/* ======================================================
   🔍 SEARCH BUSINESS FRAME BY NAME
   GET /business-frames/search?name=
====================================================== */
export const searchBusinessFrameByName = (name) =>
  API.get("/search", { params: { name } });

/* ======================================================
   🟢 ADD IMAGE TO BUSINESS FRAME
   POST /business-frames/{businessFrameId}/images
====================================================== */
export const addImageToBusinessFrame = (businessFrameId, imageId) =>
  API.post(`/${businessFrameId}/images`, { imageId });

/* ======================================================
   ↻ UPDATE BUSINESS FRAME COVER IMAGE
   PATCH /business-frames/{businessFrameId}/cover-image
====================================================== */
export const updateBusinessFrameCoverImage = (businessFrameId, coverImage) => {
  const formData = new FormData();

  formData.append("coverImage", coverImage);

  return API.patch(`/${businessFrameId}/cover-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ UPDATE BUSINESS FRAME NAME
   PATCH /business-frames/{businessFrameId}/name
====================================================== */
export const updateBusinessFrameName = (businessFrameId, businessFrameName) =>
  API.patch(`/${businessFrameId}/name`, null, {
    params: { businessFrameName },
  });

/* ======================================================
   ↻ UPDATE BUSINESS FRAME CODE
   PATCH /business-frames/{businessFrameId}/code
====================================================== */
export const updateBusinessFrameCode = (businessFrameId, businessFrameCode) =>
  API.patch(`/${businessFrameId}/code`, null, {
    params: { businessFrameCode },
  });

/* ======================================================
   ↻ UPDATE STATUS
   PATCH /business-frames/{businessFrameId}/status/{status}
====================================================== */
export const updateBusinessFrameStatus = (businessFrameId, status) =>
  API.patch(`/${businessFrameId}/status/${status}`);

/* ======================================================
   🗑 SOFT DELETE BUSINESS FRAME
   PATCH /business-frames/{businessFrameId}/soft-delete
====================================================== */
export const softDeleteBusinessFrame = (businessFrameId) =>
  API.patch(`/${businessFrameId}/soft-delete`);

/* ======================================================
   ♻ RESTORE BUSINESS FRAME
   PATCH /business-frames/{businessFrameId}/restore
====================================================== */
export const restoreBusinessFrame = (businessFrameId) =>
  API.patch(`/${businessFrameId}/restore`);

/* ======================================================
   ❌ REMOVE IMAGE FROM BUSINESS FRAME
   DELETE /business-frames/{businessFrameId}/images/{imageId}
====================================================== */
export const removeImageFromBusinessFrame = (businessFrameId, imageId) =>
  API.delete(`/${businessFrameId}/images/${imageId}`);

/* ======================================================
   ⛔ HARD DELETE BUSINESS FRAME
   DELETE /business-frames/{businessFrameId}/hard-delete
====================================================== */
export const hardDeleteBusinessFrame = (businessFrameId) =>
  API.delete(`/${businessFrameId}/hard-delete`);
