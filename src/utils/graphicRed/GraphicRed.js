import React from 'react'
import './GraphicRed.css'
import Graph from 'react-graph-vis'
import { ArrowRight } from "react-bootstrap-icons";

export default function GraphicRed(props) {
  const { layer, setActiveLayer, tipo } = props

  let nodes = []
  let edges = []

  layer.map((element, index) => {
    if (tipo === 0)
      nodes.push({
        id: index,
        label: 'Capa ' + (index + 1),
        title: 'Capa ' + (index + 1),
      })
    else
      nodes.push({
        id: index,
        label: element.class,
        title: 'Capa ' + (index + 1),
      })
    return null
  })

  for (let index = 1; index < layer.length; index++) {
    edges.push({ from: index - 1, to: index })
  }
  console.log(edges)
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
    select: function (event) {
      const { nodes } = event
      setActiveLayer(nodes[0])
      // console.log(nodes[0])
    },
  }
  return (
    <>
      <div className="row">
        <div className="col-md-1"
             style={{
               display: 'flex',
               alignItems: "center",
               marginBottom: "2rem"
             }}>
          <div className="col-md-6" style={{ writingMode: 'vertical-rl' }}>ENTRADA</div>
          <div className="col-md-6"><ArrowRight style={{ "fontSize": "xxx-large" }}/></div>
        </div>
        <div className="mynetwork col-md-10">
          <Graph graph={graph} options={options} events={events}/>
        </div>
        <div className="col-md-1"
             style={{
               display: 'flex',
               alignItems: "center",
               marginBottom: "2rem"
             }}>
          <div className="col-md-6"><ArrowRight style={{ "fontSize": "xxx-large" }}/></div>
          <div className="col-md-6" style={{ writingMode: 'vertical-rl' }}>SALIDA</div>
        </div>
      </div>
    </>
  )
}
