import React from "react"
import N4LFooter from "../../components/footer/N4LFooter"
import N4LNavBar from "../../components/navBar/N4LNavBar"
import Editor from "../editor/Editor"

export default function Starting() {
  return (
    <>
      <N4LNavBar/>
      Añadir menú de elección de la arquitectura dependiendo del enfoque
      <Editor/>
      <N4LFooter/>
    </>
  )
}