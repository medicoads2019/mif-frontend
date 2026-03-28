import { createApi } from "./baseApi";

const API = createApi("/start-screen-images");

/* ======================================================
   CREATE
   POST /start-screen-images/create
====================================================== */
export const createStartScreenImage = (data) => {
  const formData = new FormData();
  formData.append("imageName", data.imageName);
  if (data.createdBy) formData.append("createdBy", data.createdBy);
  if (data.startScreenImage)
    formData.append("startScreenImage", data.startScreenImage);
  return API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   GET ALL
   GET /start-screen-images/all
====================================================== */
export const getAllStartScreenImages = () => API.get("/all");

/* ======================================================
   GET ACTIVE (showInStartScreen=true, status=ACTIVE)
   GET /start-screen-images/active
====================================================== */
export const getActiveStartScreenImages = () => API.get("/active");

/* ======================================================
   GET BY ID
   GET /start-screen-images/:id
====================================================== */
export const getStartScreenImageById = (id) => API.get(`/${id}`);

/* ======================================================
   GET BY SOFT DELETE
   GET /start-screen-images/soft-delete/:value
====================================================== */
export const getStartScreenImagesBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   UPDATE IMAGE
   PATCH /start-screen-images/:id/image
====================================================== */
export const updateStartScreenImageFile = (id, file) => {
  const formData = new FormData();
  formData.append("startScreenImage", file);
  return API.patch(`/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   UPDATE NAME
   PATCH /start-screen-images/:id/name
====================================================== */
export const updateStartScreenImageName = (id, imageName) =>
  API.patch(`/${id}/name`, { imageName });

/* ======================================================
   UPDATE STATUS
   PATCH /start-screen-images/:id/status/:status
====================================================== */
export const updateStartScreenImageStatus = (id, status) =>
  API.patch(`/${id}/status/${status}`);

/* ======================================================
   UPDATE SHOW IN START SCREEN
   PATCH /start-screen-images/:id/show-in-start-screen/:value
====================================================== */
export const updateShowInStartScreen = (id, value) =>
  API.patch(`/${id}/show-in-start-screen/${value}`);

/* ======================================================
   REORDER
   PATCH /start-screen-images/reorder
====================================================== */
export const reorderStartScreenImages = (orderedIds) =>
  API.patch("/reorder", { orderedIds });

/* ======================================================
   SOFT DELETE
   PATCH /start-screen-images/:id/soft-delete
====================================================== */
export const softDeleteStartScreenImage = (id) =>
  API.patch(`/${id}/soft-delete`);

/* ======================================================
   RESTORE
   PATCH /start-screen-images/:id/restore
====================================================== */
export const restoreStartScreenImage = (id) => API.patch(`/${id}/restore`);

/* ======================================================
   HARD DELETE
   DELETE /start-screen-images/:id/hard-delete
====================================================== */
export const hardDeleteStartScreenImage = (id) =>
  API.delete(`/${id}/hard-delete`);
