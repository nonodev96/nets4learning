import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ backgroundColor: "#222", height: "100vh", fontSize: "4em" }}>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="display-1 fw-bold text-white" style={{ fontSize: "4em", }}>404</h1>
        <h4 className="fw-bold text-white" style={{ fontSize: "1em", }}>No se ha encontrado la página solicitada</h4>
        <p className="lead">
          <Link className="alert-link" to={process.env.REACT_APP_DOMAIN}>Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}
