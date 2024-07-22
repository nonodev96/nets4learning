import { Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import PreProcessDataFrame from './PreProcessDataFrame'
import WaitingPlaceholder from '../loading/WaitingPlaceholder'


/**
 * @typedef PreProcessDataFrameProps_t
 * @type {import('./PreProcessDataFrame').PreProcessDataFrameProps_t}
 */

/** 
 * @typedef PreProcessDataFrameCardProps_t
 * @property {boolean} isDataFrameUpload
 */

/**
 * 
 * @param {PreProcessDataFrameProps_t & PreProcessDataFrameCardProps_t} props 
 * @returns 
 */
export default function PreProcessDataFrameCard(props) {
  const {
    dataFrameOriginal,
    setDataFrameOriginal,
    dataFrameProcessed,
    setDataFrameProcessed,
    isDataFrameProcessed,
    setIsDataFrameProcessed,
    isDataFrameUpload
  } = props

  return <>
    <Card className={'mt-3'}>
      <Card.Header>
        <h3><Trans i18nKey={'dataframe-form'} /></h3>
      </Card.Header>
      <Card.Body>
        {!isDataFrameUpload && <>
          <WaitingPlaceholder title={''} />
        </>}
        {isDataFrameUpload && <>
          <PreProcessDataFrame
            dataFrameOriginal={dataFrameOriginal}
            setDataFrameOriginal={setDataFrameOriginal}
            dataFrameProcessed={dataFrameProcessed}
            setDataFrameProcessed={setDataFrameProcessed}
            
            isDataFrameProcessed={isDataFrameProcessed}
            setIsDataFrameProcessed={setIsDataFrameProcessed} />
          </>}
      </Card.Body>
    </Card>
  </>
}