import { createApi } from "./baseApi";

/**
 * =========================================
 * Axios Instance (ENV based)
 * =========================================
 */
const API = createApi("/employees");

/* ======================================================
   CREATE EMPLOYEE
   POST /employees/create
====================================================== */
export const createEmployee = (data) => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  if (data.middleName) formData.append("middleName", data.middleName);
  formData.append("lastName", data.lastName);
  formData.append("mobileNumber", data.mobileNumber);
  formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
  if (data.gender) formData.append("gender", data.gender);
  if (data.userType) formData.append("userType", data.userType);
  if (data.createdBy) formData.append("createdBy", data.createdBy);
  if (data.profilePhoto) formData.append("profilePhoto", data.profilePhoto);

  return API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   GET ALL EMPLOYEES
   GET /employees/all
====================================================== */
export const getAllEmployees = () => API.get("/all");

/* ======================================================
   GET EMPLOYEE BY ID
   GET /employees/{employeeId}
====================================================== */
export const getEmployeeById = (employeeId) => API.get(`/${employeeId}`);

/* ======================================================
   GET EMPLOYEE BY MOBILE
   GET /employees/mobile/{mobileNumber}
====================================================== */
export const getEmployeeByMobile = (mobileNumber) =>
  API.get(`/mobile/${mobileNumber}`);

/* ======================================================
   GET EMPLOYEE BY EMAIL
   GET /employees/email?email=
====================================================== */
export const getEmployeeByEmail = (email) =>
  API.get("/email", { params: { email } });

/* ======================================================
   GET EMPLOYEES BY STATUS
   GET /employees/status/{status}
====================================================== */
export const getEmployeesByStatus = (status) => API.get(`/status/${status}`);

/* ======================================================
   GET EMPLOYEES BY USER TYPE
   GET /employees/user-type/{userType}
====================================================== */
export const getEmployeesByUserType = (userType) =>
  API.get(`/user-type/${userType}`);

/* ======================================================
   GET EMPLOYEES BY SOFT DELETE
   GET /employees/soft-delete/{value}
====================================================== */
export const getEmployeesBySoftDelete = (value) =>
  API.get(`/soft-delete/${value}`);

/* ======================================================
   UPDATE PROFILE PHOTO
   PATCH /employees/{employeeId}/profile-photo
====================================================== */
export const updateEmployeeProfilePhoto = (employeeId, profilePhoto) => {
  const formData = new FormData();
  formData.append("profilePhoto", profilePhoto);
  return API.patch(`/${employeeId}/profile-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ======================================================
   UPDATE PERSONAL INFO
   PATCH /employees/{employeeId}/personal-info
====================================================== */
export const updateEmployeePersonalInfo = (employeeId, data) =>
  API.patch(`/${employeeId}/personal-info`, data);

/* ======================================================
   UPDATE PASSWORD
   PATCH /employees/{employeeId}/password
====================================================== */
export const updateEmployeePassword = (employeeId, password) =>
  API.patch(`/${employeeId}/password`, { password });

/* ======================================================
   UPDATE STATUS
   PATCH /employees/{employeeId}/status/{status}
====================================================== */
export const updateEmployeeStatus = (employeeId, status) =>
  API.patch(`/${employeeId}/status/${status}`);

/* ======================================================
   UPDATE USER TYPE
   PATCH /employees/{employeeId}/user-type/{userType}
====================================================== */
export const updateEmployeeUserType = (employeeId, userType) =>
  API.patch(`/${employeeId}/user-type/${userType}`);

/* ======================================================
   VERIFY MOBILE OTP
   PATCH /employees/{employeeId}/verify-mobile-otp
====================================================== */
export const verifyEmployeeMobileOtp = (employeeId) =>
  API.patch(`/${employeeId}/verify-mobile-otp`);

/* ======================================================
   VERIFY EMAIL OTP
   PATCH /employees/{employeeId}/verify-email-otp
====================================================== */
export const verifyEmployeeEmailOtp = (employeeId) =>
  API.patch(`/${employeeId}/verify-email-otp`);

/* ======================================================
   SOFT DELETE EMPLOYEE
   PATCH /employees/{employeeId}/soft-delete
====================================================== */
export const softDeleteEmployee = (employeeId) =>
  API.patch(`/${employeeId}/soft-delete`);

/* ======================================================
   RESTORE EMPLOYEE
   PATCH /employees/{employeeId}/restore
====================================================== */
export const restoreEmployee = (employeeId) =>
  API.patch(`/${employeeId}/restore`);

/* ======================================================
   HARD DELETE EMPLOYEE
   DELETE /employees/{employeeId}/hard-delete
====================================================== */
export const hardDeleteEmployee = (employeeId) =>
  API.delete(`/${employeeId}/hard-delete`);
