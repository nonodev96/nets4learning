import React, { useContext } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import LinearRegressionContext from '@context/LinearRegressionContext'
import LinearRegressionDataContext from '@context/LinearRegressionDataContext'
import alertHelper from '@utils/alertHelper'
import { UPLOAD } from '@/DATA_MODEL'

import LinearRegressionDatasetForm from './LinearRegressionDatasetForm'

export default function LinearRegressionDataset ({ dataset_id }) {

  const { t } = useTranslation()
  const { i_model } = useContext(LinearRegressionContext)
  const { tmpModel, setTmpModel } = useContext(LinearRegressionDataContext)

  const handleChange_FileUpload_CSV = async (files, event) => {
    if (files.length < 1) {
      console.error(t('error.load-json-csv'))
      return
    }
    try {
      const file_csv = new File([files[0]], files[0].name, { type: files[0].type })

      dfd.readCSV(file_csv).then((_dataframe) => {

        setTmpModel((prevState) => ({
          ...prevState,
          datasets: [{
            is_dataset_upload     : true,
            csv                 : files[0].name,
            info                : '',
            path                : '',
            dataframe_original  : _dataframe,
            dataframe_processed : _dataframe,
            isDatasetProcessed  : false,
            dataframe_transforms: []
          }]
        }))
      })
      await alertHelper.alertSuccess(t('alert.file-upload-success'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = (files, event) => {
    console.log({ files })
  }

  const handleSubmit_ProcessDataset = (e) => {

  }

  return <>
    {dataset_id === UPLOAD && <>
      <DragAndDrop name={'csv'}
                   accept={{ 'text/csv': ['.csv'] }}
                   text={t('drag-and-drop.csv')}
                   labelFiles={t('drag-and-drop.label-files-one')}
                   function_DropAccepted={handleChange_FileUpload_CSV}
                   function_DropRejected={handleChange_FileUpload_CSV_reject} />

      {tmpModel.dataframeOriginal && <>
        <Form onSubmit={handleSubmit_ProcessDataset}>
          <LinearRegressionDatasetForm />
        </Form>
      </>}
      {!tmpModel.dataframeOriginal && <>
        <p className="placeholder-glow">
          <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-file')}</small>
          <span className="placeholder col-12"></span>
        </p>
      </>}
    </>}
    {dataset_id !== UPLOAD && <>
      {i_model.DESCRIPTION()}
    </>}
  </>
}