import { createApi } from "./baseApi";

const API = createApi("/restrictions");

export const getAllRestrictions = () => API.get("/");

export const upsertRestriction = (userType, permissions) =>
  API.put(`/${userType}`, { permissions });

export const seedRestrictions = () => API.post("/seed");
