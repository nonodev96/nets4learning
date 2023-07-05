import DragAndDrop from '../../../components/dragAndDrop/DragAndDrop'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import LinearRegressionDatasetForm from './LinearRegressionDatasetForm'
import { UPLOAD } from '../../../DATA_MODEL'
import { Form } from 'react-bootstrap'
import LinearRegressionContext from '../../../context/LinearRegressionContext'

export default function LinearRegressionDataset ({ dataset_id }) {

  const { t } = useTranslation()
  const { i_model, tmpModel, setTmpModel } = useContext(LinearRegressionContext)

  const handleChange_FileUpload_CSV = (files, event) => {
    console.log(files)

    setTmpModel({
      ...tmpModel,
      datasets: []
    })
  }

  const handleChange_FileUpload_CSV_reject = (files, event) => {

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