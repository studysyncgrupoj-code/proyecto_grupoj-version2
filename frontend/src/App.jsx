import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import i18n from "./i18n/index.js";

function App() {
  useEffect(() => {
    let active = true;

    async function loadLanguage() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token");

        if (!user?.id || !token) return;

        const response = await fetch(
          `/api/settings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const settings = await response.json();

        if (active && ["es", "en", "pt"].includes(settings.language)) {
          await i18n.changeLanguage(settings.language);
        }
      } catch (error) {
        console.error("Error cargando idioma:", error);
      }
    }

    loadLanguage();

    return () => {
      active = false;
    };
  }, []);

  return <AppRoutes />;
}

export default App;
