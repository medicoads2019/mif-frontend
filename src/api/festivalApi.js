import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/festivals");

/* ======================================================
   🟢 CREATE FESTIVAL
   POST /festivals/create-festival
====================================================== */
export const createFestival = (data) => {
  const formData = new FormData();

  formData.append("festivalName", data.festivalName);
  formData.append("festivalDate", data.festivalDate);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("coverImage", data.coverImage);

  return API.post("/create-festival", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL FESTIVALS
   GET /festivals/all
====================================================== */
export const getAllFestivals = () => API.get("/all");

/* ======================================================
   🔍 GET FESTIVAL BY ID
   GET /festivals/{festivalId}
====================================================== */
export const getFestivalById = (festivalId) => API.get(`/${festivalId}`);

/* ======================================================
   🔍 GET FESTIVALS BY STATUS
   GET /festivals/status/{status}
====================================================== */
export const getFestivalsByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET FESTIVALS BY SOFT DELETE
   GET /festivals/soft-delete/{value}
====================================================== */
export const getFestivalsBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED FESTIVALS
   GET /festivals/published
====================================================== */
export const getPublishedFestivals = () => API.get(`/published`);

/* ======================================================
   🔍 SEARCH FESTIVAL BY NAME
   GET /festivals/search?name=
====================================================== */
export const searchFestivalByName = (name) =>
  API.get(`/search`, { params: { name } });

/* ======================================================
   🟢 ADD IMAGE TO FESTIVAL
   POST /festivals/{festivalId}/images
====================================================== */
export const addImageToFestival = (festivalId, imageId) =>
  API.post(`/${festivalId}/images`, { imageId });

/* ======================================================
   ↻ UPDATE FESTIVAL COVER IMAGE
   PATCH /festivals/{festivalId}/cover-image
====================================================== */
export const updateFestivalCoverImage = (festivalId, coverImage) => {
  const formData = new FormData();

  formData.append("coverImage", coverImage);

  return API.patch(`/${festivalId}/cover-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ ADD IMAGE TO FESTIVAL (PATCH)
   PATCH /festivals/{festivalId}/images/{imageId}
====================================================== */
export const addImageToFestivalPatch = (festivalId, imageId) =>
  API.patch(`/${festivalId}/images/${imageId}`);

/* ======================================================
   ⛔ REMOVE IMAGE FROM FESTIVAL
   DELETE /festivals/{festivalId}/images/{imageId}
====================================================== */
export const removeImageFromFestival = (festivalId, imageId) =>
  API.delete(`/${festivalId}/images/${imageId}`);

/* ======================================================
   ↻ UPDATE FESTIVAL STATUS
   PATCH /festivals/{festivalId}/status/{status}
====================================================== */
export const updateFestivalStatus = (festivalId, status) =>
  API.patch(`/${festivalId}/status/${status}`);

/* ======================================================
   ↻ UPDATE FESTIVAL NAME
   PATCH /festivals/{festivalId}/name
====================================================== */
export const updateFestivalName = (festivalId, festivalName) =>
  API.patch(`/${festivalId}/name`, null, {
    params: { festivalName },
  });

/* ======================================================
   ↻ UPDATE FESTIVAL DATE
   PATCH /festivals/{festivalId}/date
====================================================== */
export const updateFestivalDate = (festivalId, festivalDate) =>
  API.patch(`/${festivalId}/date`, null, {
    params: { festivalDate },
  });

/* ======================================================
   🗑 SOFT DELETE FESTIVAL
   PATCH /festivals/{festivalId}/soft-delete
====================================================== */
export const softDeleteFestival = (festivalId) =>
  API.patch(`/${festivalId}/soft-delete`);

/* ======================================================
   ♻ RESTORE FESTIVAL
   PATCH /festivals/{festivalId}/restore
====================================================== */
export const restoreFestival = (festivalId) =>
  API.patch(`/${festivalId}/restore`);

/* ======================================================
   ⛔ HARD DELETE FESTIVAL
   DELETE /festivals/{festivalId}/hard-delete
====================================================== */
export const hardDeleteFestival = (festivalId) =>
  API.delete(`/${festivalId}/hard-delete`);
