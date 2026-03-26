import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import {
  HolderOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PageHeader from "../../components/common/PageHeader";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import {
  createContactUs,
  deleteContactUs,
  getAllContactUs,
  reorderContactUs,
  updateContactUs,
} from "../../api/contactUsApi";

const initialValues = {
  mobileNumber: "",
  emailAddress: "",
  whatsappNumber: "",
};

const hasAtLeastOneField = (values) =>
  Boolean(
    values.mobileNumber?.trim() ||
    values.emailAddress?.trim() ||
    values.whatsappNumber?.trim(),
  );

const SortableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props["data-row-key"] });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...props}>
      {props.children}
    </tr>
  );
};

const DragHandle = ({ id }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <HolderOutlined
      {...attributes}
      {...listeners}
      style={{ cursor: "grab", color: "#999", fontSize: 16 }}
    />
  );
};

export default function ContactUs() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await getAllContactUs();
      setContacts(data?.data || []);
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message || "Failed to load Contact Us records",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = contacts.findIndex(
      (item) => item.contactUsId === active.id,
    );
    const newIndex = contacts.findIndex((item) => item.contactUsId === over.id);

    const nextOrder = arrayMove(contacts, oldIndex, newIndex);
    setContacts(nextOrder);

    try {
      const payload = nextOrder.map((item, index) => ({
        contactUsId: item.contactUsId,
        orderIndex: index,
      }));
      await reorderContactUs(payload);
      await fetchContacts();
      messageApi.success("Contact Us order updated");
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message ||
          "Failed to reorder Contact Us records",
      );
      fetchContacts();
    }
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    form.setFieldsValue(initialValues);
    setOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      mobileNumber: record.mobileNumber,
      emailAddress: record.emailAddress,
      whatsappNumber: record.whatsappNumber,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!hasAtLeastOneField(values)) {
        messageApi.error("Enter at least one contact field");
        return;
      }

      setSubmitting(true);

      if (editingRecord?.contactUsId) {
        await updateContactUs(editingRecord.contactUsId, values);
        messageApi.success("Contact Us record updated");
      } else {
        await createContactUs(values);
        messageApi.success("Contact Us record created");
      }

      closeModal();
      fetchContacts();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      messageApi.error(
        error?.response?.data?.message || "Failed to save Contact Us record",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await deleteContactUs(contactId);
      messageApi.success("Contact Us record deleted");
      setContacts((prev) =>
        prev.filter((item) => item.contactUsId !== contactId),
      );
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message || "Failed to delete Contact Us record",
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Sr. No.",
        key: "srNo",
        width: 80,
        render: (_, record, index) => (
          <Space>
            <DragHandle id={record.contactUsId} />
            {index + 1}
          </Space>
        ),
      },
      {
        title: "Mobile Number",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
      },
      {
        title: "Email Address",
        dataIndex: "emailAddress",
        key: "emailAddress",
      },
      {
        title: "WhatsApp Number",
        dataIndex: "whatsappNumber",
        key: "whatsappNumber",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (value) => (value ? new Date(value).toLocaleString() : "-"),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Edit Contact Us">
              <Button
                type="text"
                icon={<EditIcon />}
                style={{ fontSize: 18 }}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>

            <Popconfirm
              title="Delete Contact Us"
              description="Are you sure you want to delete this record?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.contactUsId)}
            >
              <Tooltip title="Delete Contact Us">
                <Button
                  type="text"
                  icon={<DeleteIcon />}
                  style={{ fontSize: 18 }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <>
      {contextHolder}

      <PageHeader
        title="Contact Us"
        breadcrumb={["Dashboard", "Contact Us"]}
        extra={
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={fetchContacts}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Contact
            </Button>
          </Space>
        }
      />

      <Card>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={contacts.map((item) => item.contactUsId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              columns={columns}
              dataSource={contacts}
              rowKey="contactUsId"
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              scroll={{ x: 900 }}
              components={{
                body: {
                  row: SortableRow,
                },
              }}
            />
          </SortableContext>
        </DndContext>
      </Card>

      <Modal
        title={editingRecord ? "Edit Contact Us" : "Create Contact Us"}
        open={open}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            extra="At least one of mobile number, email address, or WhatsApp number is required."
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="emailAddress"
            rules={[
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item label="WhatsApp Number" name="whatsappNumber">
            <Input placeholder="Enter WhatsApp number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
