import React from "react";
import Footer from "./footer/Footer";
import "./Home.css";
import NavBar from "./navBar/NavBar";
import InitialMenu from "./views/initialMenu/InitialMenu";

export default function Home() {
  return (
    <>
      <NavBar/>
      <div className="wrapper container">
        <h1 className="titulos">Bienvenido a Nets4learning, para continuar selecciona una de estas disciplinas </h1>
        <InitialMenu/>
      </div>
      <Footer/>
    </>
  );
}
