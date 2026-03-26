const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];
const HR_ROLES = ["HR", "SUPER_HR"];
const USER_ROLES = ["USER"];

export const normalizeRole = (role) => (role || "").toUpperCase();

export const getDefaultPathForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (ADMIN_ROLES.includes(normalizedRole)) return "/";
  if (
    HR_ROLES.includes(normalizedRole) ||
    USER_ROLES.includes(normalizedRole)
  ) {
    return "/clients";
  }
  return "/auth/login";
};

const matchPathPrefix = (pathname, prefix) => {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

export const canAccessPath = (role, pathname) => {
  const normalizedRole = normalizeRole(role);

  if (pathname.startsWith("/auth")) return true;
  if (pathname === "/unauthorized") return true;

  if (ADMIN_ROLES.includes(normalizedRole)) return true;

  if (HR_ROLES.includes(normalizedRole)) {
    return (
      matchPathPrefix(pathname, "/clients") ||
      matchPathPrefix(pathname, "/employees") ||
      matchPathPrefix(pathname, "/profile")
    );
  }

  if (USER_ROLES.includes(normalizedRole)) {
    return (
      matchPathPrefix(pathname, "/clients") ||
      matchPathPrefix(pathname, "/profile")
    );
  }

  return false;
};
