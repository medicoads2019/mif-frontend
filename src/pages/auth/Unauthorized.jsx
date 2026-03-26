import { Button, Result } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getDefaultPathForRole } from "../../auth/rbac";

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const restrictedPath = location.state?.from?.pathname || "this page";

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="403"
        title="Access Denied"
        subTitle={`You are not allowed to access ${restrictedPath}.`}
        extra={
          <Button
            type="primary"
            onClick={() =>
              navigate(getDefaultPathForRole(role), { replace: true })
            }
          >
            Go to allowed page
          </Button>
        }
      />
    </div>
  );
}
