import { createApi } from "./baseApi";

const API = createApi("/contact-us");

export const getAllContactUs = () => API.get("/all");

export const createContactUs = (data) => API.post("/create", data);

export const reorderContactUs = (data) => API.patch("/reorder", data);

export const updateContactUs = (contactId, data) =>
  API.patch(`/${contactId}`, data);

export const deleteContactUs = (contactId) => API.delete(`/${contactId}`);
