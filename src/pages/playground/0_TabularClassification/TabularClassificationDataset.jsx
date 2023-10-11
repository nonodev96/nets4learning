import React from 'react'
import { useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'

import TabularClassificationDatasetForm from '@pages/playground/0_TabularClassification/TabularClassificationDatasetForm'

import { UPLOAD } from '@/DATA_MODEL'
import alertHelper from '@utils/alertHelper'

export default function TabularClassificationDataset (props) {
  const {
    dataset,
    datasets,
    setDatasets,
    datasetIndex,
    setDatasetIndex,
    iModelInstance
  } = props

  const { t } = useTranslation()
  // region Dataset
  const handleChange_FileUpload_CSV = async (files, _event) => {
    if (files.length !== 1) {
      console.error(t('error.load-json-csv'))
      return
    }
    try {
      const file_csv = new File([files[0]], files[0].name, { type: files[0].type })
      dfd.readCSV(file_csv).then((_dataframe) => {
        // setDataframeOriginal(_dataframe)
        // setObjectToPredict({})
      })
      await alertHelper.alertSuccess(t('success.file-upload'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = async (_files, _event) => {
    await alertHelper.alertError(t('error.file-not-valid'))
  }
  // endregion

  return <>
    {dataset === UPLOAD && <>
      <DragAndDrop name={'csv'}
                   accept={{ 'text/csv': ['.csv'] }}
                   text={t('drag-and-drop.csv')}
                   labelFiles={t('drag-and-drop.label-files-one')}
                   function_DropAccepted={handleChange_FileUpload_CSV}
                   function_DropRejected={handleChange_FileUpload_CSV_reject} />
      {datasets.length > 0 && datasets[datasetIndex].is_dataset_upload === true && <>
        <TabularClassificationDatasetForm datasets={datasets}
                                          setDatasets={setDatasets}
                                          datasetIndex={datasetIndex}
                                          setDatasetIndex={setDatasetIndex}
        />
      </>}
      {datasets.length > 0 && datasets[datasetIndex].is_dataset_processed === true && <>
        <p className="placeholder-glow">
          <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-file')}</small>
          <span className="placeholder col-12"></span>
        </p>
      </>}
    </>}
    {dataset !== UPLOAD && <>{iModelInstance.DESCRIPTION()}</>}
  </>
}