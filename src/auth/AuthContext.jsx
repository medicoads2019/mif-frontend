import { createContext, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "employeeAuthSession";

const readStoredSession = () => {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawValue) return { token: "", employee: null };
    const parsedValue = JSON.parse(rawValue);
    return {
      token: parsedValue?.token || "",
      employee: parsedValue?.employee || null,
    };
  } catch {
    return { token: "", employee: null };
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredSession);

  const login = ({ token, employee }) => {
    const nextSession = {
      token: token || "",
      employee: employee || null,
    };
    setSession(nextSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession({ token: "", employee: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateEmployee = (employee) => {
    setSession((current) => {
      const nextSession = { ...current, employee };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      return nextSession;
    });
  };

  const value = useMemo(
    () => ({
      token: session.token,
      employee: session.employee,
      role: session.employee?.userType || "",
      isAuthenticated: Boolean(session.token && session.employee),
      login,
      logout,
      updateEmployee,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
