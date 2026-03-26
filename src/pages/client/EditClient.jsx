import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  Tabs,
  Tag,
  Avatar,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Divider,
  Spin,
  Upload,
  Image,
  message,
  Popconfirm,
  Descriptions,
} from "antd";

import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  AppstoreOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import {
  getClientById,
  updateClientPersonalInfo,
  updateClientBusinessInfo,
  updateClientStatus,
  updateClientUserType,
  updateClientPassword,
  updateClientProfilePhoto,
  updateClientSubscription,
  verifyClientMobileOtp,
  verifyClientEmailOtp,
  softDeleteClient,
  setClientBusinessFrameIds,
  setClientClientFrameIds,
  removeBusinessFrameImageIdFromClient,
  removeClientFrameImageIdFromClient,
} from "../../api/clientApi";

import { getBusinessFrameByCode } from "../../api/businessFrameApi";
import { getClientFrameByCode } from "../../api/clientFrameApi";
import { getImageById as getBFImageById } from "../../api/businessFrameImageApi";
import { getImageById as getCFImageById } from "../../api/clientFrameImageApi";

const { Title, Text } = Typography;
const { Option } = Select;

const VALID_STATUSES = ["PENDING", "ACTIVE", "BLOCKED", "SUSPENDED"];
const VALID_USER_TYPES = ["DEMO", "PREMIUM", "GUEST"];

const statusColor = {
  ACTIVE: "green",
  PENDING: "orange",
  BLOCKED: "red",
  SUSPENDED: "volcano",
};

const userTypeColor = {
  PREMIUM: "gold",
  DEMO: "blue",
  GUEST: "default",
};

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [personalForm] = Form.useForm();
  const [businessForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [subscriptionForm] = Form.useForm();

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingSubscription, setSavingSubscription] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingUserType, setUpdatingUserType] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(null);

  // ── My Frames state ──────────────────────────────────────────────────
  const [bfCodeInput, setBfCodeInput] = useState("");
  const [bfSearching, setBfSearching] = useState(false);
  const [bfFound, setBfFound] = useState(null); // { businessFrameName, imageIds }
  const [bfApplying, setBfApplying] = useState(false);
  const [bfThumbnails, setBfThumbnails] = useState({}); // imageId -> thumbnailUrl
  const [bfRemoving, setBfRemoving] = useState(null); // imageId being removed

  const [cfCodeInput, setCfCodeInput] = useState("");
  const [cfSearching, setCfSearching] = useState(false);
  const [cfFound, setCfFound] = useState(null); // { clientFrameName, imageIds }
  const [cfApplying, setCfApplying] = useState(false);
  const [cfThumbnails, setCfThumbnails] = useState({}); // imageId -> thumbnailUrl
  const [cfRemoving, setCfRemoving] = useState(null); // imageId being removed

  /* =========================================
     LOAD CLIENT
  ========================================= */
  const loadClient = async () => {
    try {
      setLoading(true);
      const res = await getClientById(id);
      const data = res?.data?.data;
      setClient(data);

      personalForm.setFieldsValue({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.slice(0, 10)
          : undefined,
        gender: data.gender,
        alternateMobileNumber: data.alternateMobileNumber,
        instagram: data.socialMediaLinks?.instagram,
        facebook: data.socialMediaLinks?.facebook,
        youtube: data.socialMediaLinks?.youtube,
        other: data.socialMediaLinks?.other,
      });

      businessForm.setFieldsValue({
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        designation: data.designation,
        websiteUrl: data.websiteUrl,
        businessContactNumber: data.businessContactNumber,
        businessWhatsappNumber: data.businessWhatsappNumber,
        addressLine1: data.businessAddress?.addressLine1,
        addressLine2: data.businessAddress?.addressLine2,
        city: data.businessAddress?.city,
        state: data.businessAddress?.state,
        country: data.businessAddress?.country,
        pincode: data.businessAddress?.pincode,
      });

      if (data.currentSubscription) {
        subscriptionForm.setFieldsValue({
          planId: data.currentSubscription.planId,
          subscriptionStatus: data.currentSubscription.subscriptionStatus,
          startDate: data.currentSubscription.startDate
            ? data.currentSubscription.startDate.slice(0, 10)
            : undefined,
          endDate: data.currentSubscription.endDate
            ? data.currentSubscription.endDate.slice(0, 10)
            : undefined,
        });
      }
    } catch (error) {
      message.error("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, [id]);

  /* =========================================
     LOAD FRAME THUMBNAILS (when client changes)
  ========================================= */
  useEffect(() => {
    if (!client) return;

    const fetchBfThumbnails = async () => {
      const ids = client.businessFrameIds || [];
      const map = {};
      await Promise.all(
        ids.map(async (imgId) => {
          try {
            const res = await getBFImageById(imgId);
            const d = res?.data?.data;
            map[imgId] = d?.thumbnailUrl || d?.imageUrl || null;
          } catch {
            map[imgId] = null;
          }
        }),
      );
      setBfThumbnails(map);
    };

    const fetchCfThumbnails = async () => {
      const ids = client.clientFrameIds || [];
      const map = {};
      await Promise.all(
        ids.map(async (imgId) => {
          try {
            const res = await getCFImageById(imgId);
            const d = res?.data?.data;
            map[imgId] = d?.thumbnailUrl || d?.imageUrl || null;
          } catch {
            map[imgId] = null;
          }
        }),
      );
      setCfThumbnails(map);
    };

    fetchBfThumbnails();
    fetchCfThumbnails();
  }, [client]);

  /* =========================================
     REMOVE BUSINESS FRAME IMAGE ID
  ========================================= */
  const handleRemoveBusinessFrameImageId = async (imgId) => {
    try {
      setBfRemoving(imgId);
      await removeBusinessFrameImageIdFromClient(id, imgId);
      message.success("Business frame image removed from client");
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Failed to remove business frame image",
      );
    } finally {
      setBfRemoving(null);
    }
  };

  /* =========================================
     REMOVE CLIENT FRAME IMAGE ID
  ========================================= */
  const handleRemoveClientFrameImageId = async (imgId) => {
    try {
      setCfRemoving(imgId);
      await removeClientFrameImageIdFromClient(id, imgId);
      message.success("Client frame image removed from client");
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to remove client frame image",
      );
    } finally {
      setCfRemoving(null);
    }
  };

  const onSavePersonal = async (values) => {
    try {
      setSavingPersonal(true);
      const payload = {
        firstName: values.firstName,
        middleName: values.middleName || null,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        alternateMobileNumber: values.alternateMobileNumber || null,
        socialMediaLinks: {
          instagram: values.instagram || null,
          facebook: values.facebook || null,
          youtube: values.youtube || null,
          other: values.other || null,
        },
      };
      await updateClientPersonalInfo(id, payload);
      message.success("Personal info updated");
      loadClient();
    } catch (error) {
      message.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSavingPersonal(false);
    }
  };

  /* =========================================
     UPDATE BUSINESS INFO
  ========================================= */
  const onSaveBusiness = async (values) => {
    try {
      setSavingBusiness(true);
      const payload = {
        businessName: values.businessName || null,
        businessCategory: values.businessCategory || null,
        designation: values.designation || null,
        websiteUrl: values.websiteUrl || null,
        businessContactNumber: values.businessContactNumber || null,
        businessWhatsappNumber: values.businessWhatsappNumber || null,
        businessAddress: {
          addressLine1: values.addressLine1 || null,
          addressLine2: values.addressLine2 || null,
          city: values.city || null,
          state: values.state || null,
          country: values.country || null,
          pincode: values.pincode || null,
        },
      };
      await updateClientBusinessInfo(id, payload);
      message.success("Business info updated");
      loadClient();
    } catch (error) {
      message.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSavingBusiness(false);
    }
  };

  /* =========================================
     UPDATE PASSWORD
  ========================================= */
  const onSavePassword = async (values) => {
    try {
      setSavingPassword(true);
      await updateClientPassword(id, values.password);
      message.success("Password updated");
      passwordForm.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  /* =========================================
     UPDATE STATUS
  ========================================= */
  const handleStatusChange = async (status) => {
    try {
      setUpdatingStatus(true);
      await updateClientStatus(id, status);
      message.success(`Status updated to ${status}`);
      loadClient();
    } catch (error) {
      message.error(error?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================
     UPDATE USER TYPE
  ========================================= */
  const handleUserTypeChange = async (userType) => {
    try {
      setUpdatingUserType(true);
      await updateClientUserType(id, userType);
      message.success(`User type updated to ${userType}`);
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "User type update failed",
      );
    } finally {
      setUpdatingUserType(false);
    }
  };

  /* =========================================
     PROFILE PHOTO UPLOAD
  ========================================= */
  const beforePhotoUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 5) {
      message.error("Image must be smaller than 5MB");
      return Upload.LIST_IGNORE;
    }
    handlePhotoUpload(file);
    return false;
  };

  const handlePhotoUpload = async (file) => {
    try {
      setUploadingPhoto(true);
      setPhotoPreview(URL.createObjectURL(file));
      await updateClientProfilePhoto(id, file);
      message.success("Profile photo update in progress");
      setTimeout(loadClient, 3000);
    } catch (error) {
      message.error(error?.response?.data?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* =========================================
     UPDATE SUBSCRIPTION
  ========================================= */
  const onSaveSubscription = async (values) => {
    try {
      setSavingSubscription(true);
      await updateClientSubscription(id, {
        planId: values.planId,
        subscriptionStatus: values.subscriptionStatus,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        autoRenew: false,
      });
      message.success("Subscription updated");
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Subscription update failed",
      );
    } finally {
      setSavingSubscription(false);
    }
  };

  /* =========================================
     OTP VERIFICATION
  ========================================= */
  const handleVerifyMobileOtp = async () => {
    try {
      await verifyClientMobileOtp(id);
      message.success("Mobile OTP verified");
      loadClient();
    } catch (error) {
      message.error(error?.response?.data?.message || "Verification failed");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      await verifyClientEmailOtp(id);
      message.success("Email OTP verified");
      loadClient();
    } catch (error) {
      message.error(error?.response?.data?.message || "Verification failed");
    }
  };

  /* =========================================
     MY FRAMES – Business Frame
  ========================================= */
  const handleSearchBusinessFrame = async () => {
    if (!bfCodeInput.trim()) return;
    try {
      setBfSearching(true);
      setBfFound(null);
      const res = await getBusinessFrameByCode(
        bfCodeInput.trim().toUpperCase(),
      );
      const data = res?.data?.data;
      if (data) {
        setBfFound({
          businessFrameName: data.businessFrameName,
          imageIds: data.imageIds || [],
        });
      } else {
        message.warning("Business frame not found");
      }
    } catch {
      message.error("Business frame not found for that code");
    } finally {
      setBfSearching(false);
    }
  };

  const handleApplyBusinessFrame = async () => {
    if (!bfFound) return;
    try {
      setBfApplying(true);
      // Merge new imageIds with existing ones — no duplicates
      const existing = client?.businessFrameIds || [];
      const newIds = bfFound.imageIds || [];
      const merged = [...new Set([...existing, ...newIds])];
      await setClientBusinessFrameIds(id, merged);
      const added = merged.length - existing.length;
      message.success(
        `Business frame "${bfFound.businessFrameName}" applied — ${added} new image(s) added (${merged.length} total)`,
      );
      setBfCodeInput("");
      setBfFound(null);
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to apply business frame",
      );
    } finally {
      setBfApplying(false);
    }
  };

  /* =========================================
     MY FRAMES – Client Frame
  ========================================= */
  const handleSearchClientFrame = async () => {
    if (!cfCodeInput.trim()) return;
    try {
      setCfSearching(true);
      setCfFound(null);
      const res = await getClientFrameByCode(cfCodeInput.trim().toUpperCase());
      const data = res?.data?.data;
      if (data) {
        setCfFound({
          clientFrameName: data.clientFrameName,
          imageIds: data.imageIds || [],
        });
      } else {
        message.warning("Client frame not found");
      }
    } catch {
      message.error("Client frame not found for that code");
    } finally {
      setCfSearching(false);
    }
  };

  const handleApplyClientFrame = async () => {
    if (!cfFound) return;
    try {
      setCfApplying(true);
      // Merge new imageIds with existing ones — no duplicates
      const existing = client?.clientFrameIds || [];
      const newIds = cfFound.imageIds || [];
      const merged = [...new Set([...existing, ...newIds])];
      await setClientClientFrameIds(id, merged);
      const added = merged.length - existing.length;
      message.success(
        `Client frame "${cfFound.clientFrameName}" applied — ${added} new image(s) added (${merged.length} total)`,
      );
      setCfCodeInput("");
      setCfFound(null);
      loadClient();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to apply client frame",
      );
    } finally {
      setCfApplying(false);
    }
  };

  /* =========================================
     RENDER
  ========================================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!client) {
    return (
      <Card>
        <Text type="danger">Client not found.</Text>
        <br />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/clients")}
          style={{ marginTop: 16 }}
        >
          Back to Clients
        </Button>
      </Card>
    );
  }

  const fullName = [client.firstName, client.middleName, client.lastName]
    .filter(Boolean)
    .join(" ");

  const tabItems = [
    /* ─────────────── TAB 1: OVERVIEW ─────────────── */
    {
      key: "overview",
      label: "Overview",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Space>
              {client.profilePhotoThumbnailUrl ? (
                <Avatar src={client.profilePhotoThumbnailUrl} size={80} />
              ) : (
                <Avatar icon={<UserOutlined />} size={80} />
              )}
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {fullName}
                </Title>
                <Text type="secondary">{client.email}</Text>
                <br />
                <Tag color={statusColor[client.clientStatus] || "default"}>
                  {client.clientStatus}
                </Tag>
                <Tag color={userTypeColor[client.userType] || "default"}>
                  {client.userType}
                </Tag>
              </div>
            </Space>

            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Client ID">
                {client.clientId}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {client.mobileNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {client.email}
              </Descriptions.Item>
              <Descriptions.Item label="Alternate Mobile">
                {client.alternateMobileNumber || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {client.gender || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {client.dateOfBirth ? client.dateOfBirth.slice(0, 10) : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile OTP Verified">
                <Tag color={client.mobileOtpVerified ? "green" : "red"}>
                  {client.mobileOtpVerified ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email OTP Verified">
                <Tag color={client.emailOtpVerified ? "green" : "red"}>
                  {client.emailOtpVerified ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Referral Code">
                {client.referralCode || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="My Referral Code">
                {client.myReferralCode}
              </Descriptions.Item>
              <Descriptions.Item label="Business Name">
                {client.businessName || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Business Category">
                {client.businessCategory || "—"}
              </Descriptions.Item>
            </Descriptions>

            <Space>
              {!client.mobileOtpVerified && (
                <Popconfirm
                  title="Verify mobile OTP for this client?"
                  onConfirm={handleVerifyMobileOtp}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="dashed">Mark Mobile OTP Verified</Button>
                </Popconfirm>
              )}
              {!client.emailOtpVerified && (
                <Popconfirm
                  title="Verify email OTP for this client?"
                  onConfirm={handleVerifyEmailOtp}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="dashed">Mark Email OTP Verified</Button>
                </Popconfirm>
              )}
            </Space>
          </Space>
        </Card>
      ),
    },

    /* ─────────────── TAB 2: PERSONAL INFO ─────────────── */
    {
      key: "personal",
      label: "Personal Info",
      children: (
        <Card bordered={false}>
          <Form form={personalForm} layout="vertical" onFinish={onSavePersonal}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Middle Name" name="middleName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Gender" name="gender">
                  <Select allowClear placeholder="Select gender">
                    <Option value="MALE">Male</Option>
                    <Option value="FEMALE">Female</Option>
                    <Option value="OTHER">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Alternate Mobile"
                  name="alternateMobileNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Social Media Links</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Instagram" name="instagram">
                  <Input placeholder="Instagram URL" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Facebook" name="facebook">
                  <Input placeholder="Facebook URL" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="YouTube" name="youtube">
                  <Input placeholder="YouTube URL" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Other" name="other">
                  <Input placeholder="Other social media URL" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingPersonal}
                icon={<SaveOutlined />}
              >
                Save Personal Info
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },

    /* ─────────────── TAB 3: BUSINESS INFO ─────────────── */
    {
      key: "business",
      label: "Business Info",
      children: (
        <Card bordered={false}>
          <Form form={businessForm} layout="vertical" onFinish={onSaveBusiness}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Business Name" name="businessName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Business Category" name="businessCategory">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Designation" name="designation">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Website URL" name="websiteUrl">
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Business Contact Number"
                  name="businessContactNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="WhatsApp Number"
                  name="businessWhatsappNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Business Address</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Address Line 1" name="addressLine1">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Address Line 2" name="addressLine2">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="City" name="city">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="State" name="state">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Country" name="country">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Pincode" name="pincode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingBusiness}
                icon={<SaveOutlined />}
              >
                Save Business Info
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },

    /* ─────────────── TAB 4: PROFILE PHOTO ─────────────── */
    {
      key: "photo",
      label: "Profile Photo",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" size="large">
            <div>
              <Title level={5}>Current Profile Photo</Title>
              {client.profilePhotoOriginalUrl ? (
                <Image
                  src={photoPreview || client.profilePhotoThumbnailUrl}
                  alt="Profile"
                  width={160}
                  height={160}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <Avatar icon={<UserOutlined />} size={160} />
              )}
            </div>

            <div>
              <Title level={5}>Update Profile Photo</Title>
              <Upload
                beforeUpload={beforePhotoUpload}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploadingPhoto}>
                  Choose New Photo
                </Button>
              </Upload>
              <br />
              <Text type="secondary">
                Max 5MB. Photo will be processed asynchronously.
              </Text>
            </div>
          </Space>
        </Card>
      ),
    },

    /* ─────────────── TAB 5: STATUS & TYPE ─────────────── */
    {
      key: "status",
      label: "Status & Type",
      children: (
        <Card bordered={false}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Client Status</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current:{" "}
                <Tag color={statusColor[client.clientStatus] || "default"}>
                  {client.clientStatus}
                </Tag>
              </Text>
              <Select
                value={client.clientStatus}
                onChange={handleStatusChange}
                loading={updatingStatus}
                style={{ width: 200 }}
              >
                {VALID_STATUSES.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </div>

            <Divider />

            <div>
              <Title level={5}>User Type</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current:{" "}
                <Tag color={userTypeColor[client.userType] || "default"}>
                  {client.userType}
                </Tag>
              </Text>
              <Select
                value={client.userType}
                onChange={handleUserTypeChange}
                loading={updatingUserType}
                style={{ width: 200 }}
              >
                {VALID_USER_TYPES.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </div>
          </Space>
        </Card>
      ),
    },

    /* ─────────────── TAB 6: PASSWORD ─────────────── */
    {
      key: "password",
      label: "Password",
      children: (
        <Card bordered={false}>
          <Form form={passwordForm} layout="vertical" onFinish={onSavePassword}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Password is required" },
                    { min: 6, message: "Must be at least 6 characters" },
                  ]}
                >
                  <Input.Password placeholder="Enter new password" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingPassword}
                icon={<SaveOutlined />}
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },

    /* ─────────────── TAB 7: SUBSCRIPTION ─────────────── */
    {
      key: "subscription",
      label: "Subscription",
      children: (
        <Card bordered={false}>
          {client.currentSubscription ? (
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="Plan ID">
                {client.currentSubscription.planId}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {client.currentSubscription.subscriptionStatus || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {client.currentSubscription.startDate
                  ? client.currentSubscription.startDate.slice(0, 10)
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {client.currentSubscription.endDate
                  ? client.currentSubscription.endDate.slice(0, 10)
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 24 }}
            >
              No active subscription.
            </Text>
          )}

          <Title level={5}>
            {client.currentSubscription
              ? "Update Subscription"
              : "Add Subscription"}
          </Title>

          <Form
            form={subscriptionForm}
            layout="vertical"
            onFinish={onSaveSubscription}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Plan ID"
                  name="planId"
                  rules={[{ required: true, message: "Plan ID is required" }]}
                >
                  <Input placeholder="e.g. PLAN_BASIC" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Subscription Status"
                  name="subscriptionStatus"
                >
                  <Input placeholder="e.g. ACTIVE" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Start Date" name="startDate">
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="End Date" name="endDate">
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingSubscription}
                icon={<SaveOutlined />}
              >
                Save Subscription
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },

    /* ─────────────── TAB 8: MY FRAMES ─────────────── */
    {
      key: "myframes",
      label: (
        <span>
          <AppstoreOutlined />
          {" My Frames"}
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* ── Business Frames ───────────────────────────── */}
            <div>
              <Title level={5}>Business Frame</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current IDs assigned:{" "}
                {client.businessFrameIds?.length ? (
                  <Tag color="blue">
                    {client.businessFrameIds.length} image(s)
                  </Tag>
                ) : (
                  <Tag>None</Tag>
                )}
              </Text>

              <Space.Compact style={{ width: "100%", maxWidth: 480 }}>
                <Input
                  placeholder="Enter Business Frame Code (e.g. A1B2C3)"
                  value={bfCodeInput}
                  onChange={(e) => {
                    setBfCodeInput(e.target.value.toUpperCase());
                    setBfFound(null);
                  }}
                  onPressEnter={handleSearchBusinessFrame}
                  style={{ textTransform: "uppercase" }}
                />
                <Button
                  type="default"
                  loading={bfSearching}
                  onClick={handleSearchBusinessFrame}
                >
                  Search
                </Button>
              </Space.Compact>

              {bfFound && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "12px 16px",
                    background: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    borderRadius: 8,
                    maxWidth: 480,
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>Found: {bfFound.businessFrameName}</Text>
                    <Text type="secondary">
                      {bfFound.imageIds.length} image(s) will be assigned to
                      this client
                    </Text>
                    <Button
                      type="primary"
                      loading={bfApplying}
                      onClick={handleApplyBusinessFrame}
                    >
                      Apply — Set Business Frame IDs
                    </Button>
                  </Space>
                </div>
              )}

              {client.businessFrameIds?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Assigned frame images:
                  </Text>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {client.businessFrameIds.map((imgId) => (
                      <Popconfirm
                        key={imgId}
                        title="Remove this frame image from client?"
                        description="This only removes it from the client. The image itself is not deleted."
                        onConfirm={() =>
                          handleRemoveBusinessFrameImageId(imgId)
                        }
                        okText="Remove"
                        okType="danger"
                        cancelText="Cancel"
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: "visible",
                            border: "1px solid #d9d9d9",
                            cursor: "pointer",
                          }}
                        >
                          {bfThumbnails[imgId] ? (
                            <img
                              src={bfThumbnails[imgId]}
                              alt={imgId}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                color: "#999",
                                fontFamily: "monospace",
                                textAlign: "center",
                                padding: 4,
                              }}
                            >
                              {imgId.slice(-6)}
                            </div>
                          )}
                          <div
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background:
                                bfRemoving === imgId ? "#faad14" : "#ff4d4f",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: 1,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            }}
                          >
                            <CloseOutlined
                              style={{ fontSize: 9, color: "#fff" }}
                            />
                          </div>
                        </div>
                      </Popconfirm>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* ── Client Frames ─────────────────────────────── */}
            <div>
              <Title level={5}>Client Frame</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Current IDs assigned:{" "}
                {client.clientFrameIds?.length ? (
                  <Tag color="purple">
                    {client.clientFrameIds.length} image(s)
                  </Tag>
                ) : (
                  <Tag>None</Tag>
                )}
              </Text>

              <Space.Compact style={{ width: "100%", maxWidth: 480 }}>
                <Input
                  placeholder="Enter Client Frame Code (e.g. D4E5F6)"
                  value={cfCodeInput}
                  onChange={(e) => {
                    setCfCodeInput(e.target.value.toUpperCase());
                    setCfFound(null);
                  }}
                  onPressEnter={handleSearchClientFrame}
                  style={{ textTransform: "uppercase" }}
                />
                <Button
                  type="default"
                  loading={cfSearching}
                  onClick={handleSearchClientFrame}
                >
                  Search
                </Button>
              </Space.Compact>

              {cfFound && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "12px 16px",
                    background: "#f9f0ff",
                    border: "1px solid #d3adf7",
                    borderRadius: 8,
                    maxWidth: 480,
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>Found: {cfFound.clientFrameName}</Text>
                    <Text type="secondary">
                      {cfFound.imageIds.length} image(s) will be assigned to
                      this client
                    </Text>
                    <Button
                      type="primary"
                      loading={cfApplying}
                      onClick={handleApplyClientFrame}
                    >
                      Apply — Set Client Frame IDs
                    </Button>
                  </Space>
                </div>
              )}

              {client.clientFrameIds?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Assigned frame images:
                  </Text>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {client.clientFrameIds.map((imgId) => (
                      <Popconfirm
                        key={imgId}
                        title="Remove this frame image from client?"
                        description="This only removes it from the client. The image itself is not deleted."
                        onConfirm={() => handleRemoveClientFrameImageId(imgId)}
                        okText="Remove"
                        okType="danger"
                        cancelText="Cancel"
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: "visible",
                            border: "1px solid #d9d9d9",
                            cursor: "pointer",
                          }}
                        >
                          {cfThumbnails[imgId] ? (
                            <img
                              src={cfThumbnails[imgId]}
                              alt={imgId}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                color: "#999",
                                fontFamily: "monospace",
                                textAlign: "center",
                                padding: 4,
                              }}
                            >
                              {imgId.slice(-6)}
                            </div>
                          )}
                          <div
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background:
                                cfRemoving === imgId ? "#faad14" : "#ff4d4f",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: 1,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            }}
                          >
                            <CloseOutlined
                              style={{ fontSize: 9, color: "#fff" }}
                            />
                          </div>
                        </div>
                      </Popconfirm>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: <Link to="/clients">Clients</Link> },
          { title: fullName },
        ]}
      />

      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/clients")}
            />
            <span>
              {client.profilePhotoThumbnailUrl ? (
                <Avatar
                  src={client.profilePhotoThumbnailUrl}
                  size={32}
                  style={{ marginRight: 8 }}
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  size={32}
                  style={{ marginRight: 8 }}
                />
              )}
              {fullName}
            </span>
            <Tag color={statusColor[client.clientStatus] || "default"}>
              {client.clientStatus}
            </Tag>
            <Tag color={userTypeColor[client.userType] || "default"}>
              {client.userType}
            </Tag>
          </Space>
        }
      >
        <Tabs defaultActiveKey="overview" items={tabItems} />
      </Card>
    </>
  );
}
