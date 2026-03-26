import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getDemoFrameById,
  updateDemoFrameName,
  updateDemoFrameImage,
  updateDemoFrameStatus,
} from "../../api/demoFrameApi";

import DemoFrameHeader from "../../components/demoFrame/DemoFrameHeader";
import DemoFrameForm from "../../components/demoFrame/DemoFrameForm";
import DemoFrameImage from "../../components/demoFrame/DemoFrameImage";

export default function EditDemoFrame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [demoFrame, setDemoFrame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  // console.log("DEMOFRAME STATE:", demoFrame);
  /* ===============================
     LOAD DEMOFRAME
  =============================== */

  const loadDemoFrame = async () => {
    try {
      setLoading(true);

      const res = await getDemoFrameById(id);
      const data = res?.data?.data;

      setDemoFrame(data);

      form.setFieldsValue({
        demoFrameName: data.demoFrameName,
        demoFrameStatus: data.demoFrameStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load demoFrame");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemoFrame();
  }, []);

  /* ===============================
     UPDATE DEMOFRAME
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.demoFrameName !== demoFrame.demoFrameName) {
        await updateDemoFrameName(id, values.demoFrameName);
      }

      if (values.demoFrameStatus !== demoFrame.demoFrameStatus) {
        await updateDemoFrameStatus(id, values.demoFrameStatus);
      }

      message.success("DemoFrame updated successfully");

      loadDemoFrame();
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

      await updateDemoFrameImage(id, file);

      message.success("DemoFrame image updated");

      loadDemoFrame();
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

  if (loading || !demoFrame) {
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
          { title: "DemoFrames" },
          { title: demoFrame?.demoFrameName },
        ]}
      />

      {/* ================= Header ================= */}

      <DemoFrameHeader
        demoFrame={demoFrame}
        navigate={navigate}
        reloadDemoFrame={loadDemoFrame}
      />

      {/* ================= DemoFrame Form ================= */}

      <DemoFrameForm form={form} onFinish={onFinish} demoFrame={demoFrame} />

      {/* ================= DemoFrame Image ================= */}

      <DemoFrameImage
        demoFrame={demoFrame}
        handleUpload={handleUpload}
        imageUploading={imageUploading}
      />
    </Space>
  );
}
