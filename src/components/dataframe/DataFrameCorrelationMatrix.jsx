import { useEffect, useId, useRef, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import Plot from 'react-plotly.js'

import math from '@utils/math'
import { pearsonCorrelation } from '@utils/stadistics'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import DataFrameCorrelationMatrixModalDescription from '@components/dataframe/DataFrameCorrelationMatrixModalDescription'

export default function DataFrameCorrelationMatrix ({ dataframe }) {

  const [showDescription, setShowDescription] = useState(false)
  const [correlationMatrix, setCorrelationMatrix] = useState({
    xValues    : [],
    yValues    : [],
    zValues    : [],
    annotations: []
  })
  const dataframeID = useId()
  const refPlotly = useRef()
  const { t } = useTranslation()

  const handleClick_OpenModal_CorrelationMatrix = () => {
    setShowDescription(true)
  }

  useEffect(() => {
    const columns = dataframe.columns.filter((column_name) => {
      return dataframe[column_name].dtype !== 'string'
    })

    const columns_X = Array.from(columns)
    const columns_Y = Array.from(columns).reverse()

    const _matrix = []
    const _annotations = []
    for (let i = 0; i < columns_X.length; i++) {
      const column_name_x = columns_X[i]
      _matrix.push([])
      for (let j = 0; j < columns_Y.length; j++) {
        const column_name_y = columns_Y[j]
        _matrix[i][j] = pearsonCorrelation(dataframe, column_name_x, column_name_y)

        let result = {
          xref     : 'x1',
          yref     : 'y1',
          x        : column_name_x,
          y        : column_name_y,
          text     : (_matrix[i][j].toFixed(4)).toString(),
          font     : {
            family: 'Arial',
            size  : 12,
            color : 'rgb(85,255,0)'
          },
          showarrow: false,
        }
        _annotations.push(result)
      }
    }
    const new_matrix = math.transpose((_matrix))

    setCorrelationMatrix({
      xValues    : columns_X,
      yValues    : columns_Y,
      zValues    : new_matrix,
      annotations: _annotations
    })
  }, [dataframe, dataframeID])

  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'Matriz de correlación'} /></h3>
        <div className="d-flex">
          <Button onClick={handleClick_OpenModal_CorrelationMatrix}
                  size={'sm'}
                  variant={'outline-primary'}>
            Descripción
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {dataframe.columns.length === 0 &&
          <WaitingPlaceholder title={t('Waiting')} />
        }
        {dataframe.columns.length > 1 &&
          <>
            <Plot ref={refPlotly}
                  data={[{
                    x        : correlationMatrix.xValues,
                    y        : correlationMatrix.yValues,
                    z        : correlationMatrix.zValues,
                    type     : 'heatmap',
                    showscale: true
                  }]}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                  layout={{
                    title      : 'Correlation',
                    autoSize   : true,
                    height     : undefined,
                    width      : undefined,
                    xaxis      : {
                      ticks     : '',
                      ticksuffix: ' ',
                      side      : 'top',
                      autosize  : true
                    },
                    yaxis      : {
                      ticks     : '',
                      ticksuffix: ' ',
                      autosize  : true
                    },
                    annotations: correlationMatrix.annotations
                  }}
            />
          </>
        }
      </Card.Body>
    </Card>

    <DataFrameCorrelationMatrixModalDescription showDescription={showDescription}
                                                setShowDescription={setShowDescription}
    />
  </>
}
