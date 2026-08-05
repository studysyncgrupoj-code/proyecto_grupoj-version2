import { GraduationCap } from "lucide-react";


import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-glow" />

      <div className="page-loader-content">
        <div className="page-loader-logo">
          <GraduationCap size={34} strokeWidth={2.2} />
        </div>

        <div className="page-loader-brand">
          <strong>StudySync</strong>
          <span>Preparando tu espacio de estudio</span>
        </div>

        <div className="page-loader-progress">
          <span />
        </div>

        <div className="page-loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p>Cargando...</p>
      </div>
    </div>
  );
}

export default PageLoader;