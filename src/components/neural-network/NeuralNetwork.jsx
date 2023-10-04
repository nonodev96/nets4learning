import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { ArrowRight } from 'react-bootstrap-icons'
import VisGraph from 'react-vis-graph-wrapper'

export const NEURAL_NETWORK_MODES = {
  EXTEND : 'EXTEND',
  COMPACT: 'COMPACT'
}

export function NeuralNetwork ({ layers, id_parent, mode = NEURAL_NETWORK_MODES.COMPACT }) {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [graphState, setGraphState] = useState({ nodes: [], edges: [] })
  const [options, setOptions] = useState({ height: 250, width: 300 })
  const networkRef = useRef()

  const events = {
    select: () => {

    },
    zoom  : (e) => {
      // console.log(e)
      // e.preventDefault()
      // e.stopPropagation()
      // e.stopImmediatePropagation()
    }
  }

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  const getElementText = (index, element) => {
    let label = ''
    let title = ''
    if (element?._class && element?._class === 'Conv2D') {
      label = `Layer: ${index}\nK: ${element.kernelSize}\nF: ${element.filters}\nS: ${element.strides}\nK.I: ${element.kernelInitializer}\nF.A: ${element.activation}`
      title = `Layer: ${index}\nKernelSize: ${element.kernelSize}\nFilters: ${element.filters}\nStrides: ${element.strides}\nKernelInitializer: ${element.kernelInitializer}\nF. Activation: ${element.activation}`
    } else if (element?._class && element?._class === 'MaxPooling2D') {
      label = `Layer: ${index}\nP.S: [${element.poolSize[0]}, ${element.poolSize[1]}]\nS.2: [${element.strides2[0]}, ${element.strides2[1]}]`
      title = `Layer: ${index}\nPool Size: [${element.poolSize[0]}, ${element.poolSize[1]}]\nStrides 2: [${element.strides2[0]}, ${element.strides2[1]}]`
    } else {
      label = `Layer: ${index}\nU: ${element.units}\nF.A: ${element.activation}`
      title = `Layer: ${index}\nUnits: ${element.units}\nF.Activation: ${element.activation}`
    }
    return { label, title }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    const element = document.getElementById(id_parent)
    const cs = getComputedStyle(element)
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    const elementWidth = element.offsetWidth - paddingX - borderX
    const elementHeight = element.offsetHeight - paddingY - borderY

    setOptions(() => {
      return {
        height: Math.max(250, (elementHeight)),
        width : Math.max(350, (elementWidth))
      }
    })
    const dom = document.querySelectorAll('#vis-network canvas')[0]
    if (dom) {
      const wheel = dom.getEventListeners('wheel')
      if (wheel) {
        const listener = wheel[0].listener
        dom.removeEventListener('wheel', listener)
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowWidth, id_parent, networkRef])

  const modeCompact = useCallback(() => {
    const nodes = [], edges = []
    for (let [index, element] of Object.entries(layers)) {
      const { label, title } = getElementText(index, element)
      nodes.push({
        id   : index,
        label: label,
        title: title
      })
    }

    for (let index = 1; index < layers.length; index++) {
      edges.push({ from: index - 1, to: index })
    }
    return { edges, nodes }
  }, [layers])

  const modeExtend = useCallback(() => {
    const nodes = [], edges = []
    for (let index = 0; index < layers.length; index++) {
      let element = layers[index]
      const { label, title} = getElementText(index, element)
      for (let unit = 0; unit < layers[index].units; unit++) {
        let key_id = index + ' - ' + unit
        nodes.push({
          id: key_id,
          label: label,
          title: title,
          level: index
        })
        if (index < layers.length - 1) {
          for (let nextUnit = 0; nextUnit < layers[index + 1].units; nextUnit++) {
            edges.push({ from: key_id, to: (index + 1) + ' - ' + nextUnit })
          }
        }
      }
    }
    return { nodes, edges }
  }, [layers])

  useEffect(() => {
    switch (mode) {
      case 'COMPACT': {
        let { nodes, edges } = modeCompact()
        const graph = { nodes, edges }
        setGraphState(graph)
        break
      }
      case 'EXTEND': {
        let { nodes, edges } = modeExtend()
        const graph = { nodes, edges }
        setGraphState(graph)
        break
      }
      default:
        console.error('Error, option not valid')
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, modeCompact, modeExtend, JSON.stringify(layers)])

  return <>
    <Row className={'mt-3'}>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}
           style={{
             display     : 'flex',
             alignItems  : 'center',
             marginBottom: '2rem'
           }}>
        <div className="col-md-6"
             style={{ writingMode: 'vertical-rl' }}>
          <Trans i18nKey={'graphic-red.input'} />
        </div>
        <div className="col-md-6"
             style={{ textAlign: 'center' }}>
          <ArrowRight style={{ 'fontSize': 'xxx-large' }} />
        </div>
      </Col>
      <Col id={id_parent} xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <VisGraph graph={graphState}
                  options={{
                    layout: {
                      hierarchical: {
                        enabled  : true,
                        direction: 'LR',
                      },
                    },
                    edges : {
                      color: '#000000',
                    },
                    height: options.height + 'px',
                    // width     : options.width + "px"
                  }}
                  events={events}
                  ref={networkRef} />
      </Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}
           style={{
             display     : 'flex',
             alignItems  : 'center',
             marginBottom: '2rem'
           }}>
        <div className="col-md-6"
             style={{ textAlign: 'center' }}>
          <ArrowRight style={{ 'fontSize': 'xxx-large' }} />
        </div>
        <div className="col-md-6"
             style={{ writingMode: 'vertical-lr', textAlign: 'left' }}>
          <Trans i18nKey={'graphic-red.output'} />
        </div>
      </Col>
    </Row>
  </>
}