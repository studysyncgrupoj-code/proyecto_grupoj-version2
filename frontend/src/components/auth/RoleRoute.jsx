import { Navigate, useLocation } from "react-router-dom";

function normalizeRole(role = "") {
  return role
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getDashboardByRole(role) {
  const normalizedRole = normalizeRole(role);

  if (
    normalizedRole === "administrador" ||
    normalizedRole === "admin"
  ) {
    // Temporalmente usa el panel del profesor.
    // Después lo cambiaremos por /dashboard-admin.
    return "/dashboard-admin";
  }

  if (
    normalizedRole === "profesor" ||
    normalizedRole === "teacher"
  ) {
    return "/dashboard";
  }

  return "/dashboard-estudiante";
}

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function RoleRoute({ allowedRoles, children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const currentRole = normalizeRole(user.role);

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    normalizeRole(role),
  );

  if (!normalizedAllowedRoles.includes(currentRole)) {
    return (
      <Navigate
        to={getDashboardByRole(currentRole)}
        replace
      />
    );
  }

  return children;
}

export default RoleRoute;