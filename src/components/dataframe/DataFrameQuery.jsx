import React, { useEffect, useId, useState } from 'react'
import { Card, Col, InputGroup, Row, Form, Button } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_1 } from '@/CONSTANTS_DanfoJS'

export default function DataFrameQuery ({ dataframe }) {

  const [listWarning, setListWarning] = useState([])
  const [stringToQuery, setStringToQuery] = useState('.gt(5)')
  const [columnToQuery, setColumnToQuery] = useState('')
  const dataframeID = useId()

  useEffect(() => {
    if (dataframe.columns.length > 0) {
      setColumnToQuery(dataframe.columns[0])
    }
  }, [dataframe, dataframeID,])

  const handleClick_UpdateQuery = () => {
    if (dataframe.columns.length > 0 && columnToQuery !== '') {
      try {
        window.n4l_data = {
          dataframe
        }

        const _stringToQuery = stringToQuery.replaceAll('df[', 'window.n4l_data.dataframe[')
        console.log(columnToQuery, stringToQuery)
        // eslint-disable-next-line no-new-func
        const query = new Function(`return (window.n4l_data.dataframe['${columnToQuery}']${_stringToQuery})`)()
        let query_df = dataframe.query(query)
        console.log(query_df)
        query_df.plot(dataframeID).table({ config: TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_1 })
      } catch (e) {
        console.error(e)
      }
    }
  }

  if (VERBOSE) console.debug('render DataFramePlot')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'dataframe-query.title'} /></h3>
        <div className={'d-flex'}>

        </div>
      </Card.Header>
      <Card.Body>
        <Row className={'pb-3'}>
          <Col sm={3}>
            <InputGroup size={'sm'}>
              <InputGroup.Text>dataframe[</InputGroup.Text>
              <Form.Select id="dataframe"
                           size={'sm'}
                           placeholder="dataframe"
                           value={columnToQuery}
                           onChange={(e) => {setColumnToQuery(e.target.value)}}>
                {dataframe.columns.map((column_name, index) => {
                  return <option key={index} value={column_name}>{column_name}</option>
                })}
              </Form.Select>
              <InputGroup.Text>]</InputGroup.Text>
            </InputGroup>
          </Col>
          <Col sm={7}>
            <Form.Label htmlFor="inlineFormInputName" visuallyHidden>
              Query
            </Form.Label>
            <Form.Control id="inlineFormInputName"
                          size={'sm'}
                          placeholder={'.gt(5).and(df["Longitud petalo"].gt(5))'}
                          value={stringToQuery}
                          onChange={(e) => {setStringToQuery(e.target.value)}} />
          </Col>
          <Col sm={2}>
            <div className="d-grid gap-2">
              <Button onClick={handleClick_UpdateQuery}
                      size={'sm'}
                      variant={'outline-primary'}>
                Query
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div id={dataframeID}></div>
          </Col>
        </Row>
      </Card.Body>

      {listWarning.length !== 0 &&
        <Card.Footer>

        </Card.Footer>
      }
    </Card>
  </>
}