// import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

// const Container = styled.div`
//   width: 475px;
//   margin: 30px auto 0 auto;
//   text-align: center;
//   color: #fff;
// `;

// const Title = styled.div`
//   font-size: 58px;
// `;

// const Message = styled.div`
//   margin-top: 40px;
// `;

export default function NotFoundPage() {
  return (
    <div
      id="fondo"
      style={{
        backgroundColor: "#5B5857",
        fontSize: "18px",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        paddingTop: "40px",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* <Container> */}
      <h1 style={{ color: "white" }} >
        Error 404
      </h1>
      <Typography style={{ padding: "2rem" }} variant="h5">
        No se ha encontrado la página solicitada
      </Typography>
      <Link to={process.env.REACT_APP_DOMAIN}>Volver al inicio</Link>
      {/* </Container> */}
    </div>
  );
}
