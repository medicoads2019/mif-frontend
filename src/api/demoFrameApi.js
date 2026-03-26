import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/demoFrames");

/* ======================================================
   🟢 CREATE DEMOFRAME
   POST /demoFrames/create-demoFrame
====================================================== */
export const createDemoFrame = (data) => {
  const formData = new FormData();

  formData.append("demoFrameName", data.demoFrameName);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("demoFrameImage", data.demoFrameImage);

  return API.post("/create-demoFrame", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL DEMOFRAMES
   GET /demoFrames/all
====================================================== */
export const getAllDemoFrames = () => API.get("/all");

/* ======================================================
   🔍 GET DEMOFRAME BY ID
   GET /demoFrames/{demoFrameId}
====================================================== */
export const getDemoFrameById = (demoFrameId) => API.get(`/${demoFrameId}`);

/* ======================================================
   🔍 GET DEMOFRAMES BY STATUS
   GET /demoFrames/status/{status}
====================================================== */
export const getDemoFramesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET DEMOFRAMES BY SOFT DELETE
   GET /demoFrames/soft-delete/{value}
====================================================== */
export const getDemoFramesBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED DEMOFRAMES
   GET /demoFrames/published
====================================================== */
export const getPublishedDemoFrames = () => API.get("/published");

/* ======================================================
   🔍 SEARCH DEMOFRAME BY NAME
   GET /demoFrames/search?name=
====================================================== */
export const searchDemoFrameByName = (name) =>
  API.get("/search", {
    params: { name },
  });

/* ======================================================
   ↻ UPDATE DEMOFRAME IMAGE
   PATCH /demoFrames/{demoFrameId}/image
====================================================== */
export const updateDemoFrameImage = (demoFrameId, demoFrameImage) => {
  const formData = new FormData();

  formData.append("demoFrameImage", demoFrameImage);

  return API.patch(`/${demoFrameId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ UPDATE DEMOFRAME NAME
   PATCH /demoFrames/{demoFrameId}/name
====================================================== */
export const updateDemoFrameName = (demoFrameId, demoFrameName) =>
  API.patch(`/${demoFrameId}/name`, null, {
    params: { demoFrameName },
  });

/* ======================================================
   ↻ UPDATE STATUS
   PATCH /demoFrames/{demoFrameId}/status/{status}
====================================================== */
export const updateDemoFrameStatus = (demoFrameId, status) =>
  API.patch(`/${demoFrameId}/status/${status}`);

/* ======================================================
   ↻ UPDATE CAROUSEL STATUS
   PATCH /demoFrames/{demoFrameId}/carousel/{value}
====================================================== */
export const updateDemoFrameCarousel = (demoFrameId, value) =>
  API.patch(`/${demoFrameId}/carousel/${value}`);

/* ======================================================
   ↻ UPDATE DEMOFRAME ORDER (Drag Drop)
   PATCH /demoFrames/reorder
====================================================== */
export const reorderDemoFrames = (demoFrames) =>
  API.patch(`/reorder`, demoFrames);

/* ======================================================
   🗑 SOFT DELETE DEMOFRAME
   PATCH /demoFrames/{demoFrameId}/soft-delete
====================================================== */
export const softDeleteDemoFrame = (demoFrameId) =>
  API.patch(`/${demoFrameId}/soft-delete`);

/* ======================================================
   ♻ RESTORE DEMOFRAME
   PATCH /demoFrames/{demoFrameId}/restore
====================================================== */
export const restoreDemoFrame = (demoFrameId) =>
  API.patch(`/${demoFrameId}/restore`);

/* ======================================================
   ⛔ HARD DELETE DEMOFRAME
   DELETE /demoFrames/{demoFrameId}/hard-delete
====================================================== */
export const hardDeleteDemoFrame = (demoFrameId) =>
  API.delete(`/${demoFrameId}/hard-delete`);
