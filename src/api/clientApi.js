import { createApi } from "./baseApi";

/**
 * =========================================
 * ⭐ Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/clients");

/* ======================================================
   🟢 CREATE CLIENT
   POST /clients/create
====================================================== */
export const createClient = (data) => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  if (data.middleName) formData.append("middleName", data.middleName);
  formData.append("lastName", data.lastName);
  formData.append("mobileNumber", data.mobileNumber);
  formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
  if (data.gender) formData.append("gender", data.gender);
  if (data.businessName) formData.append("businessName", data.businessName);
  if (data.createdBy) formData.append("createdBy", data.createdBy);
  if (data.profilePhoto) formData.append("profilePhoto", data.profilePhoto);

  return API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   🔍 GET ALL CLIENTS
   GET /clients/all
====================================================== */
export const getAllClients = () => API.get("/all");

/* ======================================================
   🔍 GET CLIENT BY ID
   GET /clients/{clientId}
====================================================== */
export const getClientById = (clientId) => API.get(`/${clientId}`);

/* ======================================================
   🔍 GET CLIENT BY MOBILE
   GET /clients/mobile/{mobileNumber}
====================================================== */
export const getClientByMobile = (mobileNumber) =>
  API.get(`/mobile/${mobileNumber}`);

/* ======================================================
   🔍 GET CLIENT BY EMAIL
   GET /clients/email?email=
====================================================== */
export const getClientByEmail = (email) =>
  API.get("/email", { params: { email } });

/* ======================================================
   🔍 GET CLIENTS BY STATUS
   GET /clients/status/{status}
====================================================== */
export const getClientsByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   🔍 GET CLIENTS BY USER TYPE
   GET /clients/user-type/{userType}
====================================================== */
export const getClientsByUserType = (userType) =>
  API.get(`/user-type/${userType}`);

/* ======================================================
   🔍 GET CLIENTS BY SOFT DELETE
   GET /clients/soft-delete/{value}
====================================================== */
export const getClientsBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   ↻ UPDATE PROFILE PHOTO
   PATCH /clients/{clientId}/profile-photo
====================================================== */
export const updateClientProfilePhoto = (clientId, profilePhoto) => {
  const formData = new FormData();
  formData.append("profilePhoto", profilePhoto);
  return API.patch(`/${clientId}/profile-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   ↻ UPDATE PERSONAL INFO
   PATCH /clients/{clientId}/personal-info
====================================================== */
export const updateClientPersonalInfo = (clientId, data) =>
  API.patch(`/${clientId}/personal-info`, data);

/* ======================================================
   ↻ UPDATE BUSINESS INFO
   PATCH /clients/{clientId}/business-info
====================================================== */
export const updateClientBusinessInfo = (clientId, data) =>
  API.patch(`/${clientId}/business-info`, data);

/* ======================================================
   ↻ UPDATE PASSWORD
   PATCH /clients/{clientId}/password
====================================================== */
export const updateClientPassword = (clientId, password) =>
  API.patch(`/${clientId}/password`, { password });

/* ======================================================
   ↻ UPDATE STATUS
   PATCH /clients/{clientId}/status/{status}
====================================================== */
export const updateClientStatus = (clientId, status) =>
  API.patch(`/${clientId}/status/${status}`);

/* ======================================================
   ↻ UPDATE USER TYPE
   PATCH /clients/{clientId}/user-type/{userType}
====================================================== */
export const updateClientUserType = (clientId, userType) =>
  API.patch(`/${clientId}/user-type/${userType}`);

/* ======================================================
   ↻ UPDATE SUBSCRIPTION
   PATCH /clients/{clientId}/subscription
====================================================== */
export const updateClientSubscription = (clientId, subscription) =>
  API.patch(`/${clientId}/subscription`, subscription);

/* ======================================================
   ↻ ADD BUSINESS FRAME ID
   PATCH /clients/{clientId}/business-frames
====================================================== */
export const addBusinessFrameToClient = (clientId, businessFrameId) =>
  API.patch(`/${clientId}/business-frames`, { businessFrameId });

/* ======================================================
   ↻ SET ALL BUSINESS FRAME IMAGE IDS
   PATCH /clients/{clientId}/set-business-frame-ids
====================================================== */
export const setClientBusinessFrameIds = (clientId, imageIds) =>
  API.patch(`/${clientId}/set-business-frame-ids`, { imageIds });

/* ======================================================
   ↻ ADD CLIENT FRAME ID
   PATCH /clients/{clientId}/client-frames
====================================================== */
export const addClientFrameToClient = (clientId, clientFrameId) =>
  API.patch(`/${clientId}/client-frames`, { clientFrameId });

/* ======================================================
   ↻ SET ALL CLIENT FRAME IMAGE IDS
   PATCH /clients/{clientId}/set-client-frame-ids
====================================================== */
export const setClientClientFrameIds = (clientId, imageIds) =>
  API.patch(`/${clientId}/set-client-frame-ids`, { imageIds });

/* ======================================================
   ❌ REMOVE BUSINESS FRAME IMAGE ID FROM CLIENT
   DELETE /clients/{clientId}/business-frame-image/{imageId}
====================================================== */
export const removeBusinessFrameImageIdFromClient = (clientId, imageId) =>
  API.delete(`/${clientId}/business-frame-image/${imageId}`);

/* ======================================================
   ❌ REMOVE CLIENT FRAME IMAGE ID FROM CLIENT
   DELETE /clients/{clientId}/client-frame-image/{imageId}
====================================================== */
export const removeClientFrameImageIdFromClient = (clientId, imageId) =>
  API.delete(`/${clientId}/client-frame-image/${imageId}`);

/* ======================================================
   ↻ UPDATE SELECTED FRAME
   PATCH /clients/{clientId}/selected-frame
====================================================== */
export const updateClientSelectedFrame = (clientId, selectedFrameId) =>
  API.patch(`/${clientId}/selected-frame`, { selectedFrameId });

/* ======================================================
   ↻ VERIFY MOBILE OTP
   PATCH /clients/{clientId}/verify-mobile-otp
====================================================== */
export const verifyClientMobileOtp = (clientId) =>
  API.patch(`/${clientId}/verify-mobile-otp`);

/* ======================================================
   ↻ VERIFY EMAIL OTP
   PATCH /clients/{clientId}/verify-email-otp
====================================================== */
export const verifyClientEmailOtp = (clientId) =>
  API.patch(`/${clientId}/verify-email-otp`);

/* ======================================================
   ↻ SOFT DELETE CLIENT
   PATCH /clients/{clientId}/soft-delete
====================================================== */
export const softDeleteClient = (clientId) =>
  API.patch(`/${clientId}/soft-delete`);

/* ======================================================
   ↻ RESTORE CLIENT
   PATCH /clients/{clientId}/restore
====================================================== */
export const restoreClient = (clientId) => API.patch(`/${clientId}/restore`);

/* ======================================================
   ⛔ HARD DELETE CLIENT
   DELETE /clients/{clientId}/hard-delete
====================================================== */
export const hardDeleteClient = (clientId) =>
  API.delete(`/${clientId}/hard-delete`);
