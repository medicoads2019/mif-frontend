import { createApi } from "./baseApi";

const API = createApi("/app-content");

export const getAppContent = () => API.get("/");

export const updateAppContent = (data) => API.put("/", data);
