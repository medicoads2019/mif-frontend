import { createApi } from "./baseApi";
import axios from "axios";

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL =
  ENV_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8058" : "");

const API = createApi("/image-download");

/* ======================================================
   🔍 PREVIEW MERGED IMAGE (inline)
   GET /image-download/preview?selectedFrameId=...&festivalImageId=...
   Returns a blob URL for in-browser preview
====================================================== */
export const previewMergedImage = async (selectedFrameId, festivalImageId) => {
  const response = await axios.get(`${API_BASE_URL}/image-download/preview`, {
    params: { selectedFrameId, festivalImageId },
    responseType: "blob",
  });
  return response;
};

/* ======================================================
   ⬇️  DOWNLOAD MERGED IMAGE
   POST /image-download/merge
   Body: { selectedFrameId, festivalImageId }
   Returns a blob (PNG file) to trigger browser download
====================================================== */
export const downloadMergedImage = async (selectedFrameId, festivalImageId) => {
  const response = await API.post(
    "/merge",
    { selectedFrameId, festivalImageId },
    { responseType: "blob" },
  );
  return response;
};
