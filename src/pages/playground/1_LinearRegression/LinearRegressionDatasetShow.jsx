import React, { useCallback, useContext, useEffect, useState, useId } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { DataFrame } from 'danfojs'

import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import N4LTablePagination from '@components/table/N4LTablePagination'
import N4LSummary from '@components/summary/N4LSummary'
import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionDatasetShow() {
  const {
    datasets,
    setDatasets,

    // indexDatasetSelected,
    // setIndexDatasetSelected,

    // datasetLocal,
    // setDatasetLocal,
  } = useContext(LinearRegressionContext)

  const dataframe_original_describe_plotID = useId()
  const dataframe_processed_describe_plotID = useId()

  const { t } = useTranslation()

  // i18n
  const prefix = 'pages.playground.generator.dataset.'

  const [dataframe, setDataframe] = useState(new DataFrame())
  const [showProcessed, setShowProcessed] = useState(false)
  const [showDataset, setShowDataset] = useState(false)

  /**
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e 
   */
  const handleChange_DatasetProcessed = (e) => {
    const checked = e.target.checked
    setShowProcessed(!!checked)
    if (checked === true) {
      setDataframe(datasets.data[datasets.index].dataframe_processed)
    } else {
      setDataframe(datasets.data[datasets.index].dataframe_original)
    }
  }

  /**
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} e 
   */
  const handleChange_DatasetSelected = async (e) => {
    const index = parseInt(e.target.value)
    setDatasets((prevState) => {
      return {
        data : prevState.data,
        index: index
      }
    })
  }

  useEffect(() => {
    const canRenderDataset = datasets && datasets.data.length > 0 && datasets.index >= 0 && datasets.data[datasets.index].is_dataset_processed
    setShowDataset(canRenderDataset)
    if (canRenderDataset){
      setDataframe(datasets.data[datasets.index].dataframe_original)
    }
  }, [datasets, datasets.index])


  const updateDataFrameLocal = useCallback(async (_datasetSelected) => {
      console.log({_datasetSelected})
      if (!showDataset) {
        console.debug('!showDataset')
        return
      }
      const dataframe_original = _datasetSelected.dataframe_original
      const dataframe_processed = _datasetSelected.dataframe_processed

      dataframe_original
        .describe()
        .T
        .plot(dataframe_original_describe_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
      dataframe_processed
        .describe()
        .T
        .plot(dataframe_processed_describe_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
  }, [showDataset, dataframe_original_describe_plotID, dataframe_processed_describe_plotID])
  
  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [datasets, updateDataFrameLocal]')
    const init = async () => {
      if (datasets.data.length >= 1 && datasets.index >= 0) {
        console.log({data: datasets.data, index: datasets.index, update: datasets.data[datasets.index]})
        await updateDataFrameLocal(datasets.data[datasets.index])
      }
    }
    init().then(() => undefined)
  }, [datasets, updateDataFrameLocal])

  if (VERBOSE) console.debug('render LinearRegressionDatasetShow')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'ms-2 d-flex align-items-center gap-4'}>
          <Form.Check 
            type="switch"
            id={'linear-regression-switch-dataframe-processed'}
            reverse={true}
            size={'sm'}
            name={'linear-regression-switch-dataframe-processed'}
            disabled={!showDataset}
            label={t('Processed')}
            value={showProcessed.toString()}
            onChange={(e) => handleChange_DatasetProcessed(e)}
          />
          <Form.Group controlId={'dataset'}>
            <Form.Select 
              aria-label={'dataset'}
              size={'sm'}
              value={datasets.index}
              disabled={!showDataset}
              onChange={(e) => handleChange_DatasetSelected(e)}
            >
              <option value={-1} disabled={true}>Select Dataset</option>
              {datasets.data
                .map(({ csv }, index) => {
                  return <option key={'option_' + index} value={index}>{csv}</option>
                })}
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>
        {!showDataset && <>
          <WaitingPlaceholder title={'pages.playground.generator.waiting-for-process'} />
        </>}
        {showDataset && <>
          <Row>
            <Col className={'overflow-x-auto'}>
              <N4LTablePagination
                data_head={dataframe.columns}
                data_body={DataFrameUtils.DataFrameIterRows(dataframe)}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              {datasets.data.length >= 1 && datasets.index >= 0 && !datasets.data[datasets.index].is_dataset_upload && <>
                {/* TEXTO DEL DATASET car.info */}
                <N4LSummary
                  title={<Trans i18nKey={prefix + 'details.info'} />}
                  info={datasets.data[datasets.index].container_info} />
              </>}
              <N4LSummary
                title={<Trans i18nKey={prefix + 'details.description-original'} />}
                info={<div id={dataframe_original_describe_plotID}></div>} />
              <N4LSummary
                title={<Trans i18nKey={prefix + 'details.description-processed'} />}
                info={<div id={dataframe_processed_describe_plotID}></div>} />
            </Col>
          </Row>
        </>}

        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.histogram-processed"} />} info={<DataFrameHistogram dataframe={datasetLocal.dataframe_processed} />} />*/}
        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.violin-processed"} />} info={<DataFrameViolin dataframe={datasetLocal.dataframe_processed} />} />*/}
        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.box-processed"} />} info={<DataFrameBox dataframe={datasetLocal.dataframe_processed} />} />*/}

      </Card.Body>
    </Card>
  </>
}