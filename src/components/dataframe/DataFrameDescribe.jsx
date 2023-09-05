import { useEffect, useId, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import { TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2 } from '@/CONSTANTS_DanfoJS'

import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import DataFrameDescribeModalDescription from '@components/dataframe/DataFrameDescribeModalDescription'

export default function DataFrameDescribe ({ dataframe }) {

  const { t } = useTranslation()

  const dataframeID = useId()
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    if (dataframe.columns.length > 0) {
      dataframe.describe().T.plot(dataframeID).table({ config: TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2 })
    }
  }, [dataframe, dataframeID])

  const handleClick_OpenModal_Describe = () => {
    setShowDescription(true)
  }

  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'dataframe.describe.title'} /></h3>
        <div className="d-flex">
          <Button onClick={handleClick_OpenModal_Describe}
                  size={'sm'}
                  variant={'outline-primary'}>
            <Trans i18nKey={'dataframe.describe.description.title'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {dataframe.columns.length === 0 &&
          <WaitingPlaceholder title={t('Waiting')} />
        }
        <div id={dataframeID}></div>
      </Card.Body>
    </Card>

    <DataFrameDescribeModalDescription showDescription={showDescription}
                                       setShowDescription={setShowDescription}
    />
  </>
}