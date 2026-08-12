import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Página principal
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }

    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }

    // Sidebar
    const sidebar = document.querySelector(".app-sidebar");

    if (sidebar) {
      sidebar.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    // Contenedores principales que tengan scroll propio
    const scrollableContainers = document.querySelectorAll(
      "main, .admin-dashboard-content, .study-rooms-content, .messages-content, .profile-content",
    );

    scrollableContainers.forEach((element) => {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;