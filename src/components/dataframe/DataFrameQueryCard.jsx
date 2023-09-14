import React, { useEffect, useId, useState } from 'react'
import { Card, Col, InputGroup, Row, Form, Button } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_1 } from '@/CONSTANTS_DanfoJS'
import DataFrameQueryModalDescription from '@components/dataframe/DataFrameQueryModalDescription'
import DataFrameQuery from '@components/dataframe/DataFrameQuery'

export default function DataFrameQueryCard ({ dataframe }) {

  const [showDescription, setShowDescription] = useState(false)

  const handleClick_OpenModal_Query = () => {
    setShowDescription(true)
  }

  if (VERBOSE) console.debug('render DataFrameQueryCard')
  return <>
    <Card className={'mt-3'}>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'dataframe.query.title'} /></h3>
        <div className={'d-flex'}>
          <Button variant={'outline-primary'}
                  size={'sm'}
                  onClick={handleClick_OpenModal_Query}>
            <Trans i18nKey={'dataframe.query.description.title'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <DataFrameQuery dataframe={dataframe} />
      </Card.Body>
    </Card>

    <DataFrameQueryModalDescription showDescription={showDescription}
                                    setShowDescription={setShowDescription} />
  </>
}