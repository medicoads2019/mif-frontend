import { Alert } from "antd";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { employee } = useAuth();

  return (
    <>
      <PageHeader title="Dashboard" breadcrumb={["Dashboard"]} />

      <Alert
        type="info"
        showIcon
        message={`Welcome ${employee?.firstName || "User"}`}
      />
    </>
  );
}
