import { createApi } from "./baseApi";

const API = createApi("/clients");

export const clientLogin = (payload) => API.post("/login", payload);

export const clientForgotPassword = (payload) =>
  API.post("/forgot-password", payload);

export const clientResetPassword = (payload) =>
  API.post("/reset-password", payload);

export const clientChangePassword = (payload) =>
  API.post("/change-password", payload);

export const clientAdminUnlock = (clientId) =>
  API.patch(`/admin/unlock/${clientId}`);

export const clientLogout = (token) =>
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
