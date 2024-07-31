import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import LinearRegressionContext from '@context/LinearRegressionContext'
import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import alertHelper from '@utils/alertHelper'
import { UPLOAD } from '@/DATA_MODEL'
import { VERBOSE } from '@/CONSTANTS'

export default function LinearRegressionDataset({ dataset }) {

  const { t } = useTranslation()
  const {
    datasets,
    setDatasets,

    indexDatasetSelected,
    setIndexDatasetSelected,

    // datasetLocal,
    // setDatasetLocal,

    iModelInstance,
  } = useContext(LinearRegressionContext)

  const [showDatasetInfo, setShowDatasetInfo] = useState(false)

  const handleChange_FileUpload_CSV = async (files, _event) => {
    if (files.length < 1) {
      console.error(t('error.load-json-csv'))
      return
    }
    try {
      const file_csv = new File([files[0]], files[0].name, { type: files[0].type })
      const _dataframeOriginal = await dfd.readCSV(file_csv)
      const _dataframeProcessed = await dfd.readCSV(file_csv)
      
      setDatasets((prevState) => ([...prevState, {
        is_dataset_upload   : true,
        is_dataset_processed: false,
        csv                 : files[0].name,
        info                : '',
        path                : '',
        dataframe_original  : _dataframeOriginal,
        dataframe_processed : _dataframeProcessed,
        dataframe_transforms: []
      }]))
      setIndexDatasetSelected(datasets.length)
      // setDatasetLocal((prevState) => ({
      //   ...prevState,
      //   is_dataset_upload   : true,
      //   is_dataset_processed: false,
      //   dataframe_original  : _dataframeOriginal,
      //   dataframe_processed : _dataframeProcessed,
      //   container_info      : '',
      //   csv                 : files[0].name,
      // }))
      setShowDatasetInfo(true)
      await alertHelper.alertSuccess(t('alert.file-upload-success'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = (files, _event) => {
    if (VERBOSE) console.debug({ files })
  }

  if (VERBOSE) console.debug('render LinearRegressionDataset')
  return <>
    {dataset === UPLOAD && <>
      <DragAndDrop name={'csv'}
        accept={{ 'text/csv': ['.csv'] }}
        text={t('drag-and-drop.csv')}
        labelFiles={t('drag-and-drop.label-files-one')}
        function_DropAccepted={handleChange_FileUpload_CSV}
        function_DropRejected={handleChange_FileUpload_CSV_reject} />

      {!showDatasetInfo && <>
        <WaitingPlaceholder title={'pages.playground.generator.waiting-for-file'} />
      </>}
      {showDatasetInfo && <>
        <ol>
          {datasets.map((dataset, index) => {
            return <li key={index}>{dataset.csv}</li>
          })}
        </ol>
        <p><strong>{datasets[indexDatasetSelected].csv}</strong></p>
      </>}
    </>}
    {dataset !== UPLOAD && <>{iModelInstance.DESCRIPTION()}</>}
  </>
}
