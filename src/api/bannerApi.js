import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/banners");

/* ======================================================
   🟢 CREATE BANNER
   POST /banners/create-banner
====================================================== */
export const createBanner = (data) => {
  const formData = new FormData();

  formData.append("bannerName", data.bannerName);
  formData.append("createdBy", data.createdBy);
  formData.append("uploadedBy", data.uploadedBy);
  formData.append("bannerImage", data.bannerImage);

  return API.post("/create-banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL BANNERS
   GET /banners/all
====================================================== */
export const getAllBanners = () => API.get("/all");

/* ======================================================
   🔍 GET BANNER BY ID
   GET /banners/{bannerId}
====================================================== */
export const getBannerById = (bannerId) => API.get(`/${bannerId}`);

/* ======================================================
   🔍 GET BANNERS BY STATUS
   GET /banners/status/{status}
====================================================== */
export const getBannersByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET BANNERS BY SOFT DELETE
   GET /banners/soft-delete/{value}
====================================================== */
export const getBannersBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   🔍 GET PUBLISHED BANNERS
   GET /banners/published
====================================================== */
export const getPublishedBanners = () => API.get("/published");

/* ======================================================
   🔍 SEARCH BANNER BY NAME
   GET /banners/search?name=
====================================================== */
export const searchBannerByName = (name) =>
  API.get("/search", {
    params: { name },
  });

/* ======================================================
   ↻ UPDATE BANNER IMAGE
   PATCH /banners/{bannerId}/image
====================================================== */
export const updateBannerImage = (bannerId, bannerImage) => {
  const formData = new FormData();

  formData.append("bannerImage", bannerImage);

  return API.patch(`/${bannerId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ UPDATE BANNER NAME
   PATCH /banners/{bannerId}/name
====================================================== */
export const updateBannerName = (bannerId, bannerName) =>
  API.patch(`/${bannerId}/name`, null, {
    params: { bannerName },
  });

/* ======================================================
   ↻ UPDATE STATUS
   PATCH /banners/{bannerId}/status/{status}
====================================================== */
export const updateBannerStatus = (bannerId, status) =>
  API.patch(`/${bannerId}/status/${status}`);

/* ======================================================
   ↻ UPDATE CAROUSEL STATUS
   PATCH /banners/{bannerId}/carousel/{value}
====================================================== */
export const updateBannerCarousel = (bannerId, value) =>
  API.patch(`/${bannerId}/carousel/${value}`);

/* ======================================================
   ↻ UPDATE BANNER ORDER (Drag Drop)
   PATCH /banners/reorder
====================================================== */
export const reorderBanners = (banners) => API.patch(`/reorder`, banners);

/* ======================================================
   🗑 SOFT DELETE BANNER
   PATCH /banners/{bannerId}/soft-delete
====================================================== */
export const softDeleteBanner = (bannerId) =>
  API.patch(`/${bannerId}/soft-delete`);

/* ======================================================
   ♻ RESTORE BANNER
   PATCH /banners/{bannerId}/restore
====================================================== */
export const restoreBanner = (bannerId) => API.patch(`/${bannerId}/restore`);

/* ======================================================
   ⛔ HARD DELETE BANNER
   DELETE /banners/{bannerId}/hard-delete
====================================================== */
export const hardDeleteBanner = (bannerId) =>
  API.delete(`/${bannerId}/hard-delete`);
