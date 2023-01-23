import React from 'react'
import { ArrowRight } from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import Graph from 'react-graph-vis'
import './GraphicRed.css'

export default function GraphicRed(props) {
  const { layer, setActiveLayer, tipo } = props

  let nodes = []
  let edges = []

  layer.forEach((element, index) => {
    if (tipo === '0')
      nodes.push({ id: index, label: 'Capa ' + (index + 1), title: 'Capa ' + (index + 1) })
    else
      nodes.push({ id: index, label: element.class, title: 'Capa ' + (index + 1) })
  })

  for (let index = 1; index < layer.length; index++) {
    edges.push({ from: index - 1, to: index })
  }

  const graph = {
    nodes: nodes,
    edges: edges,
  }

  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
      },
    },
    edges: {
      color: '#e61818',
    },
    //  height: "500px",
    physics: {
      enabled: false,
    },
    interaction: {
      dragView: false,
      dragNodes: false,
    },
  }

  const events = {
    select: (event) => {
      const { nodes } = event
      setActiveLayer(nodes[0])
    },
  }

  return (
    <>
      <Row className={"mt-3"}>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}
             style={{
               display: 'flex',
               alignItems: "center",
               marginBottom: "2rem"
             }}>
          <div className="col-md-6"
               style={{ writingMode: 'vertical-rl' }}>
            ENTRADA
          </div>
          <div className="col-md-6"
               style={{ textAlign: "center" }}>
            <ArrowRight style={{ "fontSize": "xxx-large" }}/>
          </div>
        </Col>
        <Col className={"mynetwork"} xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
          <Graph graph={graph} options={options} events={events}/>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}
             style={{
               display: 'flex',
               alignItems: "center",
               marginBottom: "2rem"
             }}>
          <div className="col-md-6"
               style={{ textAlign: "center" }}>
            <ArrowRight style={{ "fontSize": "xxx-large" }}/>
          </div>
          <div className="col-md-6"
               style={{ writingMode: 'vertical-rl', textAlign: 'left' }}>
            SALIDA
          </div>
        </Col>
      </Row>
    </>
  )
}
