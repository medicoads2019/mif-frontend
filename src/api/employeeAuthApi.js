import { createApi } from "./baseApi";

const API = createApi("/employees");

export const employeeLogin = (payload) => API.post("/login", payload);

export const employeeForgotPassword = (payload) =>
  API.post("/forgot-password", payload);

export const employeeResetPassword = (payload) =>
  API.post("/reset-password", payload);

export const employeeChangePassword = (payload) =>
  API.post("/change-password", payload);

export const employeeAdminUnlock = (employeeId) =>
  API.patch(`/admin/unlock/${employeeId}`);

export const employeeLogout = (token) =>
  API.post(
    "/logout",
    { token },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  );
