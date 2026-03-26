import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBannerById,
  updateBannerName,
  updateBannerImage,
  updateBannerStatus,
} from "../../api/bannerApi";

import BannerHeader from "../../components/banner/BannerHeader";
import BannerForm from "../../components/banner/BannerForm";
import BannerImage from "../../components/banner/BannerImage";

export default function EditBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  // console.log("BANNER STATE:", banner);
  /* ===============================
     LOAD BANNER
  =============================== */

  const loadBanner = async () => {
    try {
      setLoading(true);

      const res = await getBannerById(id);
      const data = res?.data?.data;

      setBanner(data);

      form.setFieldsValue({
        bannerName: data.bannerName,
        bannerStatus: data.bannerStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  /* ===============================
     UPDATE BANNER
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.bannerName !== banner.bannerName) {
        await updateBannerName(id, values.bannerName);
      }

      if (values.bannerStatus !== banner.bannerStatus) {
        await updateBannerStatus(id, values.bannerStatus);
      }

      message.success("Banner updated successfully");

      loadBanner();
    } catch (error) {
      console.error(error);
      message.error("Update failed");
    }
  };

  /* ===============================
     UPDATE IMAGE
  =============================== */

  const handleUpload = async (file) => {
    try {
      setImageUploading(true);

      await updateBannerImage(id, file);

      message.success("Banner image updated");

      loadBanner();
    } catch (error) {
      console.error(error);
      message.error("Image update failed");
    } finally {
      setImageUploading(false);
    }

    return false;
  };

  /* ===============================
     LOADING STATE
  =============================== */

  if (loading || !banner) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* ================= Breadcrumb ================= */}

      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "Banners" },
          { title: banner?.bannerName },
        ]}
      />

      {/* ================= Header ================= */}

      <BannerHeader
        banner={banner}
        navigate={navigate}
        reloadBanner={loadBanner}
      />

      {/* ================= Banner Form ================= */}

      <BannerForm form={form} onFinish={onFinish} banner={banner} />

      {/* ================= Banner Image ================= */}

      <BannerImage
        banner={banner}
        handleUpload={handleUpload}
        imageUploading={imageUploading}
      />
    </Space>
  );
}
