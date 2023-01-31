import React, { useEffect, useRef, useState } from 'react'
import { Button } from "react-bootstrap"
import './customCanvasDrawer.css'

export default function CustomCanvasDrawer(props) {
  const { submitFunction } = props
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = 200 * 2
    canvas.height = 200 * 2
    canvas.style.width = '200px'
    canvas.style.heigt = '200px'

    const context = canvas.getContext('2d')
    context.scale(2, 2)
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 10
    contextRef.current = context

    // React to touch events on the canvas
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove)

    return () => canvas.removeEventListener("touchmove", null)
  }, [])


  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = ({ nativeEvent }) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
    }
  }

  const clear = () => {
    contextRef.current.clearRect(0, 0, 200, 200)
  }

  function handleTouchStart(e) {
    e.preventDefault()
  }

  function handleTouchMove(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const cssX = e.touches[0].clientX - rect.left
    const cssY = e.touches[0].clientY - rect.top
    //* canvasRef.current.width  / rect.width
    //* canvasRef.current.height / rect.height
    // contextRef.current.fillStyle = `hsl(${performance.now() % 360 | 0},100%,50%)`
    contextRef.current.fillRect(cssX - 10, cssY - 10, 10, 10)
  }

  return (
    <>
      <div className={"d-flex justify-content-center"}>
        <canvas id='bigcanvas'
                style={{
                  border: '1px solid black'
                }}
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onChange={startDrawing}></canvas>

      </div>
      <div className="d-grid gap-2 col-6 mx-auto mt-3"
           style={{ "gridTemplateColumns": "repeat(2, 1fr)" }}>
        <Button variant={"primary"}
                onClick={() => {
                  submitFunction()
                }}>
          Validar
        </Button>
        <Button variant={"warning"}
                onClick={() => {
                  clear()
                }}>
          Limpiar
        </Button>
      </div>
    </>
  )
}
