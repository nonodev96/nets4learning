import React from "react"
import Footer from "../../footer/Footer"
import NavBar from "../../navBar/NavBar"
import Editor from "../editor/Editor"

export default function Starting(){
    return(
        <>
        <NavBar/>

        Añadir menú de eleccion de la arquitectura dependiendo del enfoque
        <Editor/>
        <Footer/>
    </>
    )
}