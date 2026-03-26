import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/categorys");

/* ======================================================
   🟢 CREATE CATEGORY
   POST /categorys/create-category
====================================================== */
export const createCategory = (data) => {
  const formData = new FormData();

  formData.append("categoryName", data.categoryName);
  formData.append("categoryDate", data.categoryDate);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("coverImage", data.coverImage);

  return API.post("/create-category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL CATEGORY
   GET /categorys/all
====================================================== */
export const getAllCategorys = () => API.get("/all");

/* ======================================================
   🔍 GET CATEGORY BY ID
   GET /categorys/{categoryId}
====================================================== */
export const getCategoryById = (categoryId) => API.get(`/${categoryId}`);

/* ======================================================
   🔍 GET CATEGORYS BY STATUS
   GET /categorys/status/{status}
====================================================== */
export const getCategorysByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET CATEGORYS BY SOFT DELETE
   GET /categorys/soft-delete/{value}
====================================================== */
export const getCategorysBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED CATEGORYS
   GET /categorys/published
====================================================== */
export const getPublishedCategorys = () => API.get(`/published`);

/* ======================================================
   🔍 SEARCH CATEGORY BY NAME
   GET /categorys/search?name=
====================================================== */
export const searchCategoryByName = (name) =>
  API.get(`/search`, { params: { name } });

/* ======================================================
   🟢 ADD IMAGE TO CATEGORY
   POST /categorys/{categoryId}/images
====================================================== */
export const addImageToCategory = (categoryId, imageId) =>
  API.post(`/${categoryId}/images`, { imageId });

/* ======================================================
   ↻ UPDATE CATEGORY COVER IMAGE
   PATCH /categorys/{categoryId}/cover-image
====================================================== */
export const updateCategoryCoverImage = (categoryId, coverImage) => {
  const formData = new FormData();

  formData.append("coverImage", coverImage);

  return API.patch(`/${categoryId}/cover-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ ADD IMAGE TO CATEGORY (PATCH)
   PATCH /categorys/{categoryId}/images/{imageId}
====================================================== */
export const addImageToCategoryPatch = (categoryId, imageId) =>
  API.patch(`/${categoryId}/images/${imageId}`);

/* ======================================================
   ⛔ REMOVE IMAGE FROM CATEGORY
   DELETE /categorys/{categoryId}/images/{imageId}
====================================================== */
export const removeImageFromCategory = (categoryId, imageId) =>
  API.delete(`/${categoryId}/images/${imageId}`);

/* ======================================================
   ↻ UPDATE CATEGORY ORDER (Drag Drop)
   PATCH /categorys/reorder
====================================================== */
export const reorderCategorys = (categorys) => API.patch(`/reorder`, categorys);

/* ======================================================
   ↻ UPDATE CATEGORY STATUS
   PATCH /categorys/{categoryId}/status/{status}
====================================================== */
export const updateCategoryStatus = (categoryId, status) =>
  API.patch(`/${categoryId}/status/${status}`);

/* ======================================================
   ↻ UPDATE CATEGORY NAME
   PATCH /categorys/{categoryId}/name
====================================================== */
export const updateCategoryName = (categoryId, categoryName) =>
  API.patch(`/${categoryId}/name`, null, {
    params: { categoryName },
  });

/* ======================================================
   ↻ UPDATE CATEGORY DATE
   PATCH /categorys/{categoryId}/date
====================================================== */
export const updateCategoryDate = (categoryId, categoryDate) =>
  API.patch(`/${categoryId}/date`, null, {
    params: { categoryDate },
  });

/* ======================================================
   🗑 SOFT DELETE CATEGORY
   PATCH /categorys/{categoryId}/soft-delete
====================================================== */
export const softDeleteCategory = (categoryId) =>
  API.patch(`/${categoryId}/soft-delete`);

/* ======================================================
   ♻ RESTORE CATEGORY
   PATCH /categorys/{categoryId}/restore
====================================================== */
export const restoreCategory = (categoryId) =>
  API.patch(`/${categoryId}/restore`);

/* ======================================================
   ⛔ HARD DELETE CATEGORY
   DELETE /categorys/{categoryId}/hard-delete
====================================================== */
export const hardDeleteCategory = (categoryId) =>
  API.delete(`/${categoryId}/hard-delete`);
