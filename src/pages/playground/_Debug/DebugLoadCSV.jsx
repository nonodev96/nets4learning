import React from 'react'
import * as tfVis from '@tensorflow/tfjs-vis'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { VERBOSE } from '@/CONSTANTS'

export default function DebugLoadCSV () {
  const _isDebug = process.env.REACT_APP_ENVIRONMENT !== 'production'

  const handleClick_Layers = async () => {

  }

  const handleClick_Compile = async () => {

  }

  const handleClick_Fit = async () => {

  }

  const handleClick_debug_ALL = async () => {

  }

  const handleClick_Download = () => {

  }

  if(VERBOSE) console.debug('render DebugLoadCSV')
  return <>
    {
      (_isDebug) &&
      <Row className={'mt-3'}>
        <Col>
          <Card>
            <Card.Header><h3>Debug</h3></Card.Header>
            <Card.Body>
              <Card.Title>Pruebas modelo</Card.Title>


              <div className="d-grid gap-2 mt-3">
                <Button type="button"
                        onClick={async () => {
                          console.log('TODO')
                        }}
                        size={'sm'}
                        variant="primary">
                  Debug
                </Button>
                <Button type="button"
                        onClick={async () => {
                          console.log('TODO')
                          await handleClick_debug_ALL()
                        }}
                        size={'sm'}
                        variant="primary">
                  CLEAR DATA
                </Button>
                <hr />

                <Button type="button"
                        onClick={() => tfVis.visor().toggle()}
                        size={'sm'}
                        variant="outline-primary">
                  Conmutar visor
                </Button>
                <Button type="button"
                        onClick={() => handleClick_Layers}
                        size={'sm'}
                        variant="outline-secondary">
                  Definir capas
                </Button>
                <Button type="button"
                        onClick={() => handleClick_Compile}
                        size={'sm'}
                        variant="outline-warning">
                  Compilar
                </Button>
                <Button type="button"
                        onClick={() => handleClick_Fit}
                        size={'sm'}
                        variant="outline-danger">
                  Entrenar
                </Button>
                <Button type="button"
                        onClick={() => handleClick_Download}
                        size={'sm'}
                        variant="outline-success">
                  Descargar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    }
  </>
}