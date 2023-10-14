import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import alertHelper from '@utils/alertHelper'
import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'

export class Parser {
  /**
   * @typedef {Object} Parser_list_column_type_to_transform_t
   * @property {string} column_name,
   * @property {'int32'|'float32'|'string'|'label-encoder'|'one-hot-encoder'|'drop'|'ignored'} column_type,
   */

  /**
   * @typedef {Object} Parser_params_t
   * @property {'min-max-scaler'|'standard-scaler'} type_scaler
   */
  /**
   * @typedef TYPE_ATTRIBUTES_OPTIONS_LIST
   * @type {Object}
   * @property {string} value
   * @property {string} text
   */

  /**
   * @typedef TYPE_ATTRIBUTES_OPTIONS
   * @type {Object}
   * @property {'string'} type
   * @property {number} index_column
   * @property {string} name
   * @property {string} name
   * @property {Array<TYPE_ATTRIBUTES_OPTIONS_LIST>} options
   */

  /**
   * @typedef TYPE_ATTRIBUTES_NUMBER
   * @type {Object}
   * @property {'int32'|'float32'} type
   * @property {number} index_column
   * @property {string} name
   */

  /**
   * @typedef TYPE_CLASSES
   * @type {Object}
   * @property {string} key
   * @property {string} name
   */

  /**
   * @typedef CUSTOM_JSON_CSV
   * @type {Object}
   * @property {boolean} missing_values
   * @property {string} missing_value_key
   * @property {Array<TYPE_CLASSES>} classes
   * @property {Array<TYPE_ATTRIBUTES_OPTIONS|TYPE_ATTRIBUTES_NUMBER>} attributes
   * @property {Array} data
   */

  /**
   * @typedef {Object} Parser_transform_t
   *
   * @property {dfd.DataFrame} dataframeProcessed
   * @property {Object.<string, dfd.LabelEncoder>} obj_encoder
   * @property {dfd.MinMaxScaler|dfd.StandardScaler} scaler
   * @property {dfd.DataFrame} X
   * @property {dfd.DataFrame} y
   * @property {Array<TYPE_ATTRIBUTES_OPTIONS|TYPE_ATTRIBUTES_NUMBER>} attributes
   * @property {Array<TYPE_CLASSES>} classes
   * @property {Array<any>} data
   */
  /**
   * @param {dfd.DataFrame} dataframeOriginal
   * @param {Array<Parser_list_column_type_to_transform_t>} list_column_type_to_transform
   * @param {Parser_params_t} params
   *
   * @return {{
   * dataframe_processed: dfd.DataFrame,
   * scaler             : dfd.MinMaxScaler | dfd.StandardScaler,
   * X                  : dfd.DataFrame,
   * y                  : dfd.DataFrame,
   * obj_encoder        : {},
   * attributes         : *[],
   * classes            : *[],
   * data               : any
   * }}
   */
  static transform (dataframeOriginal, list_column_type_to_transform, params = {}) {

    // Creamos las listas de atributos y de clases objetivos
    const list_attributes = []
    const list_classes = []

    const map_encoder = {}
    // Copiamos el dataframe
    const newDataframe = dataframeOriginal.copy()
    // Definimos los rangos
    const list_attributes_to_transform = list_column_type_to_transform.slice(0, -1)
    const column_target_to_transform = list_column_type_to_transform.slice(-1)[0]

    //  Procesamos
    for (const { column_name, column_type } of list_attributes_to_transform) {
      switch (column_type) {
        case 'int32': {
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : 'int32',
          })
          newDataframe.asType(column_name, 'int32', { inplace: true })
          break
        }
        case 'float32': {
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : 'float32',
          })
          newDataframe.asType(column_name, 'float32', { inplace: true })
          break
        }
        case 'string':
        case 'label-encoder': {
          // Codificamos las columnas de tipo string
          const encoder = new dfd.LabelEncoder()
          encoder.fit(newDataframe[column_name])
          const new_serie = encoder.transform(newDataframe[column_name].values)
          map_encoder[column_name] = encoder
          newDataframe.asType(column_name, 'string', { inplace: true })
          newDataframe.addColumn(column_name, new_serie, { inplace: true })
          const list_options = []
          for (const [key, value] of Object.entries(encoder.$labels)) {
            list_options.push({
              value: value,
              text : key,
            })
          }
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : 'label-encoder',
            options     : list_options,
          })
          break
        }
        case 'one-hot-encoder': {
          // No se usa en el preprocesamiento
          const encoder = new dfd.OneHotEncoder()
          encoder.fit(newDataframe[column_name])
          const new_serie = encoder.transform(newDataframe[column_name].values)
          map_encoder[column_name] = encoder

          newDataframe.asType(column_name, 'string', { inplace: true })
          newDataframe.addColumn(column_name, new_serie, { inplace: true })
          const list_options = []
          for (const [key, value] of Object.entries(encoder.$labels)) {
            list_options.push({
              value: value,
              text : key,
            })
          }
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : 'one-hot-encoder',
            options     : list_options,
          })
          break
        }
        case 'drop': {
          newDataframe.drop({ columns: column_name, inplace: true })
          // Eliminamos las columnas que no son necesarias del dataframe
          // const list_columns_to_drop = list_attributes_to_transform
          //   .filter(({ column_name, column_type }) => column_type === "drop")
          //   .map(({ column_name }) => column_name);
          // const newDataframe = dataframe_copy.drop({ columns: list_columns_to_drop });
          break
        }
        case 'ignored': {
          console.debug('ignored ', { column_name })
          break
        }
        default: {
          console.error('Invalid option', { column_type })
        }
      }
    }

    // TARGET
    const { column_name: column_name_target, column_type: column_type_target } = column_target_to_transform
    switch (column_type_target) {
      case 'int32': {
        break
      }
      case 'float32': {
        break
      }
      case 'string': // Por defecto se va a label encoder
      case 'label-encoder': {
        const encode_target = new dfd.LabelEncoder()
        encode_target.fit(newDataframe[column_name_target])
        const new_serie_target = encode_target.transform(newDataframe[column_name_target].values)
        map_encoder[column_name_target] = encode_target

        newDataframe.asType(column_name_target, 'string', { inplace: true })
        newDataframe.addColumn(column_name_target, new_serie_target, { inplace: true })
        for (const [key, value] of Object.entries(encode_target.$labels)) {
          list_classes.push({
            key: value, name: key,
          })
        }
        break
      }
      case 'one-hot-encoder': {
        // No se usa en el preprocesamiento
        const encode_target = new dfd.OneHotEncoder()
        encode_target.fit(newDataframe[column_name_target])
        const new_serie_target = encode_target.transform(newDataframe[column_name_target].values)
        map_encoder[column_name_target] = encode_target

        newDataframe.asType(column_name_target, 'string', { inplace: true })
        newDataframe.addColumn(column_name_target, new_serie_target, { inplace: true })
        for (const [key, value] of Object.entries(encode_target.$labels)) {
          list_classes.push({
            key: value, name: key,
          })
        }
        break
      }
      default: {
        console.error('Invalid option', { column_type_target })
      }
    }

    const data = JSON.parse(JSON.stringify([...newDataframe.values]))

    const index_of_last_column = newDataframe.columns.indexOf(column_name_target)
    const dataframe_X = newDataframe.iloc({ columns: [`:${index_of_last_column}`] })
    const dataframe_y = newDataframe[column_name_target]

    let scaler
    switch (params.type_scaler) {
      case 'min-max-scaler': {
        scaler = new dfd.MinMaxScaler()
        break
      }
      case 'standard-scaler': {
        scaler = new dfd.StandardScaler()
        break
      }
      default: {
        console.log('Error, scaler not valid')
      }
    }

    return {
      dataframe_processed: newDataframe,
      column_name_target : column_name_target,
      map_encoder        : map_encoder,
      scaler             : scaler,
      X                  : dataframe_X,
      y                  : dataframe_y,
      attributes         : list_attributes,
      classes            : list_classes,
      data               : data,
    }
  }
}

export default function TabularClassificationDatasetForm (props) {
  const {
    // TODO
    datasets, setDatasets,
    datasetIndex, setDatasetIndex,
  } = props

  const [listColumnTypeProcessed_X, setListColumnTypeProcessed_X] = useState([])
  const [listColumnTypeProcessed_y, setListColumnTypeProcessed_y] = useState([])
  const [typeScaler, setTypeScaler] = useState('min-max-scaler')

  const { t } = useTranslation()
  const prefix = 'form-dataframe.'

  // @formatter:off
  const options = [
    { value: 'int32', i18n: 'int32' },
    { value: 'float32', i18n: 'float32' },
    { value: 'string', i18n: 'string' },
    { value: 'label-encoder', i18n: 'label-encoder' },
    // TODO
    // { value: "one-hot-encoder", i18n: "one-hot-encoder" },
    { value: 'drop', i18n: 'drop' },
    { value: 'ignored', i18n: 'ignored' }
  ]
  // @formatter:on

  const isFileUploaded = () => {
    return datasets.length > 0 && datasetIndex >= 0
  }

  useEffect(() => {
    if (!isFileUploaded()) {
      console.error('Error, waiting for file')
      return
    }
    const list_X = datasets[datasetIndex].dataframe_original.columns.slice(0, -1).map((column_name, i) => {
      const dtype = datasets[datasetIndex].dataframe_original.dtypes[i]
      return {
        column_name: column_name,
        column_type: (dtype === 'string') ? 'label-encoder' : dtype,
      }
    })
    setListColumnTypeProcessed_X(list_X)
    const list_y = datasets[datasetIndex].dataframe_original.columns.slice(-1).map((column_name, i) => {
      return {
        column_name: column_name,
        column_type: datasets[datasetIndex].dataframe_original.dtypes[i],
      }
    })
    list_y[list_y.length - 1].column_type = 'label-encoder'
    setListColumnTypeProcessed_y(list_y)
  }, [datasets, datasetIndex])

  useEffect(() => {
    if (!isFileUploaded()) {
      console.error('Error, waiting for file')
      return
    }
    datasets[datasetIndex].dataframe_original.plot('plot_original').table({
      config: TABLE_PLOT_STYLE_CONFIG,
      layout: {
        title: t('dataframe-original'),
      },
    })
  }, [datasets, datasetIndex, t])

  useEffect(() => {
    if (!isFileUploaded()) {
      console.error('Error, waiting for file')
      return
    }
    if (!datasets[datasetIndex].is_dataset_processed) {
      console.log('!datasets[datasetIndex].is_dataset_processed')
      return
    }
    if (datasets[datasetIndex].dataframe_processed === null) {
      console.log('!datasets[datasetIndex].dataframe_processed')
      return
    }

    datasets[datasetIndex].dataframe_processed.plot('plot_processed').table({
      config: TABLE_PLOT_STYLE_CONFIG,
      layout: {
        title: t('dataframe-processed'),
      },
    })
  }, [datasets, datasetIndex, t])

  const handleChange_cType = (e, column_name, set_array) => {
    set_array(old_array => [...old_array.map((old_column) => {
      if (old_column.column_name === column_name)
        return { ...old_column, column_type: e.target.value }
      else
        return { ...old_column }
    })])
  }

  const handleSubmit_ProcessDataset = async (event) => {
    event.preventDefault()
    // const list = [...listColumnTypeProcessed_X, ...listColumnTypeProcessed_y]

    // const {
    //   dataframe_processed,
    //   obj_encoder,
    //   scaler,
    //   column_name_target,
    //   X,
    //   y,
    //   attributes,
    //   classes,
    //   data,
    // } = Parser.transform(dataframeOriginal, list, { type_scaler: typeScaler })
    //
    // setLayers((old_layer) => changeUnitsLastLayer(old_layer, classes.length))
    // setDataProcessed({
    //   dataframe_processed,
    //   obj_encoder,
    //   typeScaler,
    //   scaler,
    //   column_name_target,
    //   X,
    //   y,
    //
    //   attributes,
    //   classes,
    // })
    await alertHelper.alertSuccess(t('preprocessing.title'), { text: t('alert.success') })
  }

  if (VERBOSE) console.debug('render TabularClassificationDatasetForm')
  return <>
    <Card className={'mt-3'}>
      <Card.Header><h3><Trans i18nKey={'Process dataset'} /></h3></Card.Header>
      <Card.Body>
        {(!isFileUploaded()) && <>
          <p className="placeholder-glow">
            <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-file')}</small>
            <span className="placeholder col-12"></span>
          </p>
        </>}
        {(isFileUploaded()) &&
          <Form onSubmit={handleSubmit_ProcessDataset}>
            <Row>
              <Col>
                <details open={true}>
                  <summary className={'n4l-summary'}><Trans i18nKey={'dataframe-form'} /></summary>
                  <hr />
                  <Row>
                    <Col><h4><Trans i18nKey={'preprocessing.transformations-columns'} /></h4></Col>
                  </Row>
                  <Row>
                    <Col xl={10}>
                      <div className={'n4l-hr-container'}><span className={'n4l-hr-title'}>X</span></div>
                      <Row className={'mt-3 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-6'}>
                        {listColumnTypeProcessed_X
                          .map(({ column_name, column_type }, index) => {
                            return <Col key={index}>
                              <Form.Group controlId={'FormControl_' + column_name} className={'mt-2'}>
                                <Form.Label><b>{column_name}</b></Form.Label>
                                <Form.Select aria-label={'select'}
                                             size={'sm'}
                                             value={column_type}
                                             onChange={(e) => handleChange_cType(e, column_name, setListColumnTypeProcessed_X)}>
                                  {options.map((option_value, option_index) => {
                                    return <option key={column_name + '_option_' + option_index}
                                                   value={option_value.value}>
                                      {t(prefix + option_value.i18n)}
                                    </option>
                                  })}
                                </Form.Select>
                                <Form.Text className="text-muted">{column_type}</Form.Text>
                              </Form.Group>
                            </Col>
                          })}
                      </Row>
                    </Col>
                    <Col xl={2}>
                      <div className={'n4l-hr-container'}><span className={'n4l-hr-title'}>y</span></div>
                      <Row className={'mt-3 row-cols-12 row-cols-md-12 row-cols-lg-12 row-cols-xl-12 row-cols-xxl-12'}>
                        {listColumnTypeProcessed_y
                          .map(({ column_name, column_type }, index) => {
                            return <Col key={index}>
                              <Form.Group controlId={'FormControl_' + column_name} className={'mt-2'}>
                                <Form.Label><b>{column_name}</b></Form.Label>
                                <Form.Select aria-label={'select'}
                                             size={'sm'}
                                             value={column_type}
                                             disabled
                                             onChange={(e) => handleChange_cType(e, column_name, setListColumnTypeProcessed_y)}>
                                  {options.map((option_value, option_index) => {
                                    return <option key={column_name + '_option_' + option_index}
                                                   value={option_value.value}>
                                      {t(prefix + option_value.i18n)}
                                    </option>
                                  })}
                                </Form.Select>
                                <Form.Text className="text-muted">{column_type}</Form.Text>
                              </Form.Group>
                            </Col>
                          })}
                      </Row>
                    </Col>
                  </Row>
                  <hr />

                  <Row>
                    <Col><h4><Trans i18nKey={'preprocessing.transformations-set-X'} /></h4></Col>
                  </Row>
                  <Row className={'row-cols-12 row-cols-md-12 row-cols-lg-6 row-cols-xl-3 row-cols-xxl-2'}>
                    <Col>
                      <Form.Group controlId={'FormControl_Scaler'} className={'mt-2'}>
                        <Form.Label><b>Scaler</b> {typeScaler}</Form.Label>
                        <Form.Select aria-label="Selecciona un escalador"
                                     size={'sm'}
                                     defaultValue={'min-max-scaler'}
                                     onChange={(e) => setTypeScaler(e.target.value)}>
                          <option value="min-max-scaler">MinMaxScaler</option>
                          <option value="standard-scaler">StandardScaler</option>
                        </Form.Select>
                        <Form.Text className="text-muted">Scaler</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="d-grid gap-2">
                        <Button type={'submit'}
                                className={'mt-3'}>
                          <Trans i18nKey={prefix + 'submit'} />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </details>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <details>
                  <summary className={'n4l-summary'}><Trans i18nKey={'dataframe-original'} /></summary>
                  <main>
                    <Row>
                      <Col>
                        <div id={'plot_original'}></div>
                      </Col>
                    </Row>
                  </main>
                </details>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <details>
                  <summary className={'n4l-summary'}><Trans i18nKey={'dataframe-processed'} /></summary>
                  <main>
                    <Row>
                      <Col>
                        <div id={'plot_processed'}></div>
                      </Col>
                    </Row>
                  </main>
                </details>
              </Col>
            </Row>
          </Form>
        }
      </Card.Body>
    </Card>
  </>
}