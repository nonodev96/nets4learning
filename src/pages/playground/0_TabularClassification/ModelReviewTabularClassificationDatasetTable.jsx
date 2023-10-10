import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from 'react-bootstrap'

import N4LTablePagination from '@components/table/N4LTablePagination'

export default function ModelReviewTabularClassificationDatasetTable (props) {

  const { tableHead, tableBody } = props
  const { t } = useTranslation()

  return <>
    <Card className={'mt-3'}>
      <Card.Header>
        <h3><Trans i18nKey={'table.dataset'} /></h3>
      </Card.Header>
      <Card.Body className={'overflow-x-scroll'}>
        {/* i18n key */}
        <N4LTablePagination data_head={tableHead.map(v => (t(v)))}
                            data_body={tableBody} />
      </Card.Body>
    </Card>
  </>
}