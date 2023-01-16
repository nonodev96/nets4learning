import React, { useEffect, useRef, useState } from 'react'
import './customCanvasDrawer.css'

export default function CustomCanvasDrawer(props) {
  const { submitFunction } = props
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

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
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => canvas.removeEventListener("touchmove")
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
    } else {

    }
  }

  const clear = () => {
    contextRef.current.clearRect(0, 0, 200, 200);
  }

  function handleTouchStart(e) {
    e.preventDefault();
  }

  function handleTouchMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const cssX = e.touches[0].clientX - rect.left;
    const cssY = e.touches[0].clientY - rect.top;
    const pixelX = cssX //* canvasRef.current.width  / rect.width;
    const pixelY = cssY //* canvasRef.current.height / rect.height;
    // contextRef.current.fillStyle = `hsl(${performance.now() % 360 | 0},100%,50%)`;
    contextRef.current.fillRect(pixelX - 10, pixelY - 10, 10, 10);
  }

  // const startDrawing = ()=> {
  //   setIsDrawing(true)
  // }

  return (
    <>
      <div className="container-canvas">
        <canvas id='bigcanvas'
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                onChange={startDrawing}
                className="border-canvas"
        ></canvas>

      </div>
      <div className="btn-group-canvas">
        <button
          type='button'
          onClick={submitFunction}
          className="btn-custom-canvas green"
        >
          Validar
        </button>
        <button type="button" onClick={clear} className="btn-custom-canvas red">
          Limpiar
        </button>
      </div>
    </>
  )
}
