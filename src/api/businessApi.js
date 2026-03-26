import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/businesss");

/* ======================================================
   🟢 CREATE BUSINESS
   POST /businesss/create-business
====================================================== */
export const createBusiness = (data) => {
  const formData = new FormData();

  formData.append("businessName", data.businessName);
  formData.append("businessDate", data.businessDate);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("coverImage", data.coverImage);

  return API.post("/create-business", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL BUSINESS
   GET /businesss/all
====================================================== */
export const getAllBusinesss = () => API.get("/all");

/* ======================================================
   🔍 GET BUSINESS BY ID
   GET /businesss/{businessId}
====================================================== */
export const getBusinessById = (businessId) => API.get(`/${businessId}`);

/* ======================================================
   🔍 GET BUSINESSS BY STATUS
   GET /businesss/status/{status}
====================================================== */
export const getBusinesssByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET BUSINESSS BY SOFT DELETE
   GET /businesss/soft-delete/{value}
====================================================== */
export const getBusinesssBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED BUSINESSS
   GET /businesss/published
====================================================== */
export const getPublishedBusinesss = () => API.get(`/published`);

/* ======================================================
   🔍 SEARCH BUSINESS BY NAME
   GET /businesss/search?name=
====================================================== */
export const searchBusinessByName = (name) =>
  API.get(`/search`, { params: { name } });

/* ======================================================
   🟢 ADD IMAGE TO BUSINESS
   POST /businesss/{businessId}/images
====================================================== */
export const addImageToBusiness = (businessId, imageId) =>
  API.post(`/${businessId}/images`, { imageId });

/* ======================================================
   ↻ UPDATE BUSINESS COVER IMAGE
   PATCH /businesss/{businessId}/cover-image
====================================================== */
export const updateBusinessCoverImage = (businessId, coverImage) => {
  const formData = new FormData();

  formData.append("coverImage", coverImage);

  return API.patch(`/${businessId}/cover-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ ADD IMAGE TO BUSINESS (PATCH)
   PATCH /businesss/{businessId}/images/{imageId}
====================================================== */
export const addImageToBusinessPatch = (businessId, imageId) =>
  API.patch(`/${businessId}/images/${imageId}`);

/* ======================================================
   ⛔ REMOVE IMAGE FROM BUSINESS
   DELETE /businesss/{businessId}/images/{imageId}
====================================================== */
export const removeImageFromBusiness = (businessId, imageId) =>
  API.delete(`/${businessId}/images/${imageId}`);

/* ======================================================
   ↻ UPDATE BUSINESS STATUS
   PATCH /businesss/{businessId}/status/{status}
====================================================== */
export const updateBusinessStatus = (businessId, status) =>
  API.patch(`/${businessId}/status/${status}`);

/* ======================================================
   ↻ UPDATE BUSINESS NAME
   PATCH /businesss/{businessId}/name
====================================================== */
export const updateBusinessName = (businessId, businessName) =>
  API.patch(`/${businessId}/name`, null, {
    params: { businessName },
  });

/* ======================================================
   ↻ UPDATE BUSINESS DATE
   PATCH /businesss/{businessId}/date
====================================================== */
export const updateBusinessDate = (businessId, businessDate) =>
  API.patch(`/${businessId}/date`, null, {
    params: { businessDate },
  });

/* ======================================================
   🗑 SOFT DELETE BUSINESS
   PATCH /businesss/{businessId}/soft-delete
====================================================== */
export const softDeleteBusiness = (businessId) =>
  API.patch(`/${businessId}/soft-delete`);

/* ======================================================
   ♻ RESTORE BUSINESS
   PATCH /businesss/{businessId}/restore
====================================================== */
export const restoreBusiness = (businessId) =>
  API.patch(`/${businessId}/restore`);

/* ======================================================
   ⛔ HARD DELETE BUSINESS
   DELETE /businesss/{businessId}/hard-delete
====================================================== */
export const hardDeleteBusiness = (businessId) =>
  API.delete(`/${businessId}/hard-delete`);
