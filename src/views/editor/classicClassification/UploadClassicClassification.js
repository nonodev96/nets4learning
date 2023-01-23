import React, { useState } from 'react'

// TODO: Pendiente de borrar
export default function UploadClassicClassification(props) {
  const [weightFile, setWeightFile] = useState()
  const [fileJSON, setFileJSON] = useState()

  function download(filename, textInput) {
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput),
    )
    element.setAttribute('download', filename)
    document.body.appendChild(element)
    element.click()
  }

  const downloadFile = () => {
    const url = 'plantilla.json'
    download(
      url,
      `{
        "datos": [
          ["dato1", "dato2", "dato3", "dato4", "dato5","resulaado1"],
          ["dato11", "dato12", "dato13", "dato14", "dato15","resultado2"],
          ["dato21", "dato22", "dato23", "dato24", "dato25","resultado3"],
          ["dato31", "dato32", "dato33", "dato34", "dato35","resultado4"],
          ["dato41", "dato42", "dato43", "dato44", "dato45","resultado5"],
          ["dato51", "dato52", "dato53", "dato54", "dato55","resultado6"]
        ]
      }`,
    )
  }

  const handleChangeWeightFileUpload = (e) => {
    let files = e.target.files
    let reader = new FileReader()
    reader.readAsText(files[0])
    try {
      let object
      reader.onload = (e) => {
        // console.warn(e.target.result);
        object = JSON.parse(e.target.result.toString())
        console.log('Este es el objeto', object)
        setWeightFile(object)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const handleChangeJsonFileUpload = (e) => {
    let files = e.target.files
    let reader = new FileReader()
    reader.readAsText(files[0])
    try {
      let object
      reader.onload = (e) => {
        object = JSON.parse(e.target.result.toString())
        console.log('Este es el objeto', object)
        setFileJSON(object)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  return (
    <>
      <div className="header-model-editor" id={"UploadClassicClassification"}>
        <p>
          Carga tu propio dataSet con la siguiente <a href="" onClick={() => downloadFile} id="dwn-btn">estructura</a>
          pulsando este botón.
        </p>
        <input type="file"
               name="doc"
               onChange={() => handleChangeWeightFileUpload}></input>

        <input type="button"
               value="Click me"
               onClick={() => {
                 console.log('Este es el custom dataset', weightFile)
               }}></input>

        <input type="file"
               name="doc"
               onChange={() => handleChangeJsonFileUpload}></input>

        <input type="button"
               value="Click me"
               onClick={() => {
                 console.log('Este es el custom dataset', fileJSON)
               }}></input>
      </div>
    </>
  )
}
