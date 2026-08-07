import { ArrowLeft, Construction, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/AdminModulePlaceholder.css";

function AdminModulePlaceholder({
  title,
  description,
  moduleName,
}) {
  const navigate = useNavigate();

  return (
    <div className="admin-placeholder-layout">
      <Sidebar />

      <main className="admin-placeholder-content">
        <section className="admin-placeholder-card">
          <span className="admin-placeholder-eyebrow">
            <ShieldCheck size={15} />
            Módulo administrativo
          </span>

          <div className="admin-placeholder-icon">
            <Construction size={34} />
          </div>

          <h1>{title}</h1>

          <p>{description}</p>

          <div className="admin-placeholder-status">
            <span />
            {moduleName} está conectado y listo para desarrollo
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard-admin")}
          >
            <ArrowLeft size={18} />
            Volver al dashboard
          </button>
        </section>
      </main>
    </div>
  );
}

export default AdminModulePlaceholder;