import SSLocalized from "../../i18n/Localized.jsx";
import { ArrowLeft, GraduationCap, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

import "../../styles/shared/NotFound.css";
function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-glow glow-one"></div>
      <div className="notfound-glow glow-two"></div>

      <section className="notfound-card">

        <div className="notfound-logo">
          <GraduationCap size={42} />
        </div>

        <span className="notfound-tag">
          <SSLocalized text={"STUDYSYNC PLATFORM"} />
        </span>

        <h1>404</h1>

        <h2><SSLocalized text={"Página no encontrada"} /></h2>

        <p>
          <SSLocalized text={"Lo sentimos, la página que intentas visitar no existe, fue movida o el enlace ya no está disponible."} />
        </p>

        <div className="notfound-actions">

          <Link to="/" className="primary-btn">
            <Home size={18}/>
            <SSLocalized text={"Inicio"} />
          </Link>

          <Link to="/dashboard" className="secondary-btn">
            <ArrowLeft size={18}/><SSLocalized text={"Dashboard"} /></Link>

        </div>

        <div className="notfound-footer">

          <div>
            <Search size={18}/>
            <span><SSLocalized text={"Verifica la dirección URL."} /></span>
          </div>

          <div>
            <GraduationCap size={18}/>
            <span><SSLocalized text={"Continúa aprendiendo con StudySync."} /></span>
          </div>

        </div>

      </section>

    </main>
  );
}

export default NotFound;