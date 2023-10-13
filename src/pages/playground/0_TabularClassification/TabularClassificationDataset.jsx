import React from 'react'
import { useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'

import { UPLOAD } from '@/DATA_MODEL'
import alertHelper from '@utils/alertHelper'
import { VERBOSE } from '@/CONSTANTS'

export default function TabularClassificationDataset (props) {
  const {
    dataset,
    iModelInstance,
    datasets,
    setDatasets,

    datasetIndex,
    setDatasetIndex,
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
      dfd.readCSV(file_csv).then(async (_dataframe) => {
        // setDataframeOriginal(_dataframe)
        // setObjectToPredict({})

        console.log(_dataframe, datasetIndex)

        setDatasets((prevState) => {
          const newDataset = {
            missing_values   : false,
            missing_value_key: '',
            classes          : [],
            encoders         : {},
            attributes       : [],

            is_dataset_upload   : true,
            is_dataset_processed: false,
            path                : '',
            info                : '',
            csv                 : '',
            dataset_transforms  : [],
            dataframe_original  : _dataframe,
            dataframe_processed : _dataframe,
          }
          return [...prevState, newDataset]
        })
        setDatasetIndex(0)


        await alertHelper.alertSuccess(t('success.file-upload'))

      }).catch((error) => {
        console.error(error)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = async (_files, _event) => {
    await alertHelper.alertError(t('error.file-not-valid'))
  }
  // endregion

  if (VERBOSE) console.debug('render TabularClassificationDataset')
  return <>
    {dataset === UPLOAD && <>
      <DragAndDrop name={'csv'}
                   accept={{ 'text/csv': ['.csv'] }}
                   text={t('drag-and-drop.csv')}
                   labelFiles={t('drag-and-drop.label-files-one')}
                   function_DropAccepted={handleChange_FileUpload_CSV}
                   function_DropRejected={handleChange_FileUpload_CSV_reject} />
      {datasets.length === 0 && <>
        <p className="placeholder-glow">
          <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-file')}</small>
          <span className="placeholder col-12"></span>
        </p>
      </>}
    </>}
    {dataset !== UPLOAD && <>{iModelInstance.DESCRIPTION()}</>}
  </>
}