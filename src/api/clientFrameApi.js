import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/client-frames");

/* ======================================================
   🟢 CREATE CLIENT FRAME
   POST /client-frames/create
====================================================== */
export const createClientFrame = (data) => {
  const formData = new FormData();

  formData.append("clientFrameName", data.clientFrameName);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  return API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL CLIENT FRAMES
   GET /client-frames/all
====================================================== */
export const getAllClientFrames = () => API.get("/all");

/* ======================================================
   🔍 GET CLIENT FRAME BY ID
   GET /client-frames/{clientFrameId}
====================================================== */
export const getClientFrameById = (clientFrameId) =>
  API.get(`/${clientFrameId}`);

/* ======================================================
   🔍 GET CLIENT FRAMES BY STATUS
   GET /client-frames/status/{status}
====================================================== */
export const getClientFramesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET CLIENT FRAMES BY SOFT DELETE
   GET /client-frames/soft-delete/{value}
====================================================== */
export const getClientFramesBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED CLIENT FRAMES
   GET /client-frames/published
====================================================== */
export const getPublishedClientFrames = () => API.get("/published");

/* ======================================================
   🔍 GET CLIENT FRAME BY CODE
   GET /client-frames/code/{code}
====================================================== */
export const getClientFrameByCode = (code) => API.get(`/code/${code}`);

/* ======================================================
   🔍 SEARCH CLIENT FRAME BY NAME
   GET /client-frames/search?name=
====================================================== */
export const searchClientFrameByName = (name) =>
  API.get("/search", { params: { name } });

/* ======================================================
   🟢 ADD IMAGE TO CLIENT FRAME
   POST /client-frames/{clientFrameId}/images
====================================================== */
export const addImageToClientFrame = (clientFrameId, imageId) =>
  API.post(`/${clientFrameId}/images`, { imageId });

/* ======================================================
   ↻ UPDATE CLIENT FRAME COVER IMAGE
   PATCH /client-frames/{clientFrameId}/cover-image
====================================================== */
export const updateClientFrameCoverImage = (clientFrameId, coverImage) => {
  const formData = new FormData();

  formData.append("coverImage", coverImage);

  return API.patch(`/${clientFrameId}/cover-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ UPDATE CLIENT FRAME NAME
   PATCH /client-frames/{clientFrameId}/name
====================================================== */
export const updateClientFrameName = (clientFrameId, clientFrameName) =>
  API.patch(`/${clientFrameId}/name`, null, {
    params: { clientFrameName },
  });

/* ======================================================
   ↻ UPDATE STATUS
   PATCH /client-frames/{clientFrameId}/status/{status}
====================================================== */
export const updateClientFrameStatus = (clientFrameId, status) =>
  API.patch(`/${clientFrameId}/status/${status}`);

/* ======================================================
   🗑 SOFT DELETE CLIENT FRAME
   PATCH /client-frames/{clientFrameId}/soft-delete
====================================================== */
export const softDeleteClientFrame = (clientFrameId) =>
  API.patch(`/${clientFrameId}/soft-delete`);

/* ======================================================
   ♻ RESTORE CLIENT FRAME
   PATCH /client-frames/{clientFrameId}/restore
====================================================== */
export const restoreClientFrame = (clientFrameId) =>
  API.patch(`/${clientFrameId}/restore`);

/* ======================================================
   ❌ REMOVE IMAGE FROM CLIENT FRAME
   DELETE /client-frames/{clientFrameId}/images/{imageId}
====================================================== */
export const removeImageFromClientFrame = (clientFrameId, imageId) =>
  API.delete(`/${clientFrameId}/images/${imageId}`);

/* ======================================================
   ⛔ HARD DELETE CLIENT FRAME
   DELETE /client-frames/{clientFrameId}/hard-delete
====================================================== */
export const hardDeleteClientFrame = (clientFrameId) =>
  API.delete(`/${clientFrameId}/hard-delete`);
