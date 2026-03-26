import { useEffect, useState } from "react";
import { Space, Spin, Breadcrumb, Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCategoryById,
  updateCategoryName,
  updateCategoryCoverImage,
  updateCategoryStatus,
} from "../../api/categoryApi";

import { batchUploadImages } from "../../api/categoryimageApi";

import useCategoryImages from "../../hooks/useCategoryImages";

import CategoryHeader from "../../components/category/CategoryHeader";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryCoverImage from "../../components/category/CategoryCoverImage";
import CategoryImageGallery from "../../components/category/CategoryImageGallery";
import DeletedImageGallery from "../../components/category/DeletedImageGallery";
import ImageDrawer from "../../components/category/ImageDrawer";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coverUploading, setCoverUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  /* ===============================
     IMAGE HOOK
  =============================== */

  const {
    activeImages,
    deletedImages,
    selectedImage,
    setSelectedImage,
    loadAllImages,
    approveImage,
    rejectImage,
    softDelete,
    restore,
    hardDelete,
  } = useCategoryImages();

  /* ===============================
     LOAD CATEGORY
  =============================== */

  const loadCategory = async () => {
    try {
      setLoading(true);

      const res = await getCategoryById(id);
      const data = res?.data?.data;

      setCategory(data);

      await loadAllImages(id);

      form.setFieldsValue({
        categoryName: data.categoryName,
        categoryStatus: data.categoryStatus,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  /* ===============================
     UPDATE CATEGORY
  =============================== */

  const onFinish = async (values) => {
    try {
      if (values.categoryName !== category.categoryName) {
        await updateCategoryName(id, values.categoryName);
      }

      if (values.categoryStatus !== category.categoryStatus) {
        await updateCategoryStatus(id, values.categoryStatus);
      }

      message.success("Category updated successfully");

      loadCategory();
    } catch (error) {
      console.error(error);
      message.error("Update failed");
    }
  };

  /* ===============================
     COVER IMAGE
  =============================== */

  const handleCoverUpload = async (file) => {
    try {
      setCoverUploading(true);

      await updateCategoryCoverImage(id, file);

      message.success("Cover image updated");

      loadCategory();
    } catch (error) {
      console.error(error);
      message.error("Cover image update failed");
    } finally {
      setCoverUploading(false);
    }

    return false;
  };

  /* ===============================
     BATCH IMAGE UPLOAD
  =============================== */

  const handleBatchUpload = async (files) => {
    try {
      setUploadingImages(true);

      const payload = {
        categoryId: id,
        createdBy: category?.createdBy || "admin",
        uploadedBy: category?.uploadedBy || "admin",
        files,
      };

      await batchUploadImages(payload);

      message.success("Images uploaded successfully");

      loadCategory();
    } catch (error) {
      console.error(error);
      message.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  /* ===============================
     LOADING STATE
  =============================== */

  if (loading) return <Spin />;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "Categorys" },
          { title: category?.categoryName },
        ]}
      />

      <CategoryHeader
        category={category}
        navigate={navigate}
        reloadCategory={loadCategory}
      />

      <CategoryForm form={form} onFinish={onFinish} category={category} />

      <CategoryCoverImage
        category={category}
        handleCoverUpload={handleCoverUpload}
        coverUploading={coverUploading}
      />

      <CategoryImageGallery
        images={activeImages}
        uploadingImages={uploadingImages}
        handleBatchUpload={handleBatchUpload}
        setSelectedImage={setSelectedImage}
      />

      <DeletedImageGallery
        images={deletedImages}
        setSelectedImage={setSelectedImage}
      />

      <ImageDrawer
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleApprove={(id) => approveImage(id, loadCategory)}
        handleReject={(id) => rejectImage(id, loadCategory)}
        handleSoftDelete={(id) => softDelete(id, loadCategory)}
        handleRestore={(id) => restore(id, loadCategory)}
        handleHardDelete={(id) => hardDelete(id, loadCategory)}
      />
    </Space>
  );
}
