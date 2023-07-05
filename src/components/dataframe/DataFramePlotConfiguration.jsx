import { Col, Container, Form, Modal, Row, Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import React, { useContext } from 'react'
import DataFramePlotContext from '../_context/DataFramePlotContext'

export default function DataFramePlotConfiguration () {

  const {
    dataFrameLocal,

    dataframePlotConfig,
    setDataframePlotConfig,

    showOptions,
    setShowOptions,

    DEFAULT_DATAFRAME_PLOT_CONFIG,
    E_PLOTS,

    columnsValidForIndex,
    isDataFrameValidForIndex
  } = useContext(DataFramePlotContext)
  const { t } = useTranslation()

  const handleChangeCheckbox_Column = (e) => {
    const columnName = e.target.value
    const checked = e.target.checked

    const copyColumns = JSON.parse(JSON.stringify(dataframePlotConfig.COLUMNS))
    if (checked) {
      if (!copyColumns.includes(columnName)) {
        copyColumns.push(columnName)
      }
    } else {
      const columnIndex = copyColumns.indexOf(columnName)
      if (columnIndex !== -1) {
        copyColumns.splice(columnIndex, 1)
      }
    }

    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.COLUMNS = copyColumns
      return _prevState
    })
  }

  const handleClick_reset = () => {
    setDataframePlotConfig(() => {
      const resetState = { ...DEFAULT_DATAFRAME_PLOT_CONFIG }
      resetState.COLUMNS = dataFrameLocal.columns
      if (isDataFrameValidForIndex()) {
        resetState.TIME_SERIES_PLOTS.config.index = columnsValidForIndex()[0]
      }
      return resetState
    })
  }

  const handleChange_PlotConfig_LAYOUT = (e, key) => {
    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.LAYOUT[key] = e.target.value
      return _prevState
    })
  }

  const handleChange_PlotConfig_PieCharts = (e, key) => {
    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.PIE_CHARTS.config[key] = e.target.value
      return _prevState
    })
  }

  const handleChange_PlotConfig_TimeSeries = (e, key) => {
    if (key === 'index') {
      const copyColumns = JSON.parse(JSON.stringify(dataframePlotConfig.COLUMNS))
      const columnIndex = copyColumns.indexOf(e.target.valueOf())
      if (columnIndex !== -1) {
        copyColumns.splice(columnIndex, 1)
      }
      dataframePlotConfig.COLUMNS = copyColumns
    }
    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.TIME_SERIES_PLOTS.config[key] = e.target.value
      return _prevState
    })
  }
  // const handleChange_PlotConfig_DEFAULT_ = (e, key) => {
  //   setDataframePlotConfig((prevState) => {
  //     const _prevState = Object.assign({}, prevState);
  //     _prevState._DEFAULT_.config[key] = e.target.value
  //     return _prevState
  //   })
  // }

  const handleSubmit_Config = (e) => {
    e.preventDefault()
    console.log({ e })
  }

  const handleClick_SelectAllColumns = () => {
    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.COLUMNS = dataFrameLocal.columns
      return _prevState
    })
  }

  return <>
    <Modal show={showOptions} onHide={() => setShowOptions(false)} size={'xl'} fullscreen={'md-down'}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={'dataframe-plot.options'} /> {dataframePlotConfig.PLOT_ENABLE}</Modal.Title>
        <div className={'d-flex'}>
          <Button className={'ms-3'} size={'sm'} variant={'outline-warning'} onClick={handleClick_reset}>Reset</Button>
          <Button className={'ms-3'} size={'sm'} variant={'outline-primary'} onClick={handleClick_SelectAllColumns}><Trans i18nKey={'Select all columns'} /></Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit_Config}>
          <Container>
            <Row>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                <h4><Trans i18nKey={'Layout'} /></h4>
                <Row>
                  <Col lg={12} xl={12}>
                    <Form.Group controlId={'dataframe-plot.LAYOUT.title'}>
                      <Form.Label><Trans i18nKey={'Title'} /></Form.Label>
                      <Form.Control type="text"
                                    placeholder="Title"
                                    autoComplete="off"
                                    onChange={(e) => handleChange_PlotConfig_LAYOUT(e, 'title')}
                                    defaultValue={dataframePlotConfig.LAYOUT.title} />
                    </Form.Group>
                  </Col>
                  <Col lg={12} xl={12}>
                    <Form.Group controlId={'dataframe-plot.LAYOUT.x-axis'}>
                      <Form.Label><Trans i18nKey={'Title X axis'} /></Form.Label>
                      <Form.Control type="text"
                                    placeholder={t('Title X axis')}
                                    autoComplete="off"
                                    onChange={(e) => handleChange_PlotConfig_LAYOUT(e, 'x_axis')}
                                    defaultValue={dataframePlotConfig.LAYOUT.x_axis} />
                    </Form.Group>
                  </Col>
                  <Col lg={12} xl={12}>
                    <Form.Group controlId={'dataframe-plot.LAYOUT.y-axis'}>
                      <Form.Label><Trans i18nKey={'Title Y axis'} /></Form.Label>
                      <Form.Control type="text"
                                    placeholder={t('Title Y axis')}
                                    autoComplete="off"
                                    onChange={(e) => handleChange_PlotConfig_LAYOUT(e, 'y_axis')}
                                    defaultValue={dataframePlotConfig.LAYOUT.y_axis} />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                <h4><Trans i18nKey={'Columns'} /></h4>
                <div className={'overflow-y-scroll n4l-scroll-style-1'} style={{ maxHeight: '10em' }}>
                  <ol className={'mb-0'}>
                    {dataFrameLocal.columns.map((value, index) => {
                      return <li key={index}>
                        <div className="form-check">
                          <input type={'checkbox'}
                                 id={`dataframe-checkbox-${index}`}
                                 className="form-check-input"
                                 onChange={(e) => handleChangeCheckbox_Column(e)}
                                 checked={dataframePlotConfig.COLUMNS.includes(value)}
                                 value={value}
                          />
                          <label htmlFor={`dataframe-checkbox-${index}`}
                                 className="form-check-label">
                            {value}
                          </label>
                        </div>
                      </li>
                    })}
                  </ol>
                </div>
              </Col>

              {/*<hr className={"mt-3 mb-3"} />*/}
              {/*<h4><Trans i18nKey={"Config"} /></h4>*/}
              {/*<Col lg={6} xl={6}>*/}
              {/*  <Form.Group controlId={"dataframe-plot.default.x"}>*/}
              {/*    <Form.Label><Trans i18nKey={"x"} /></Form.Label>*/}
              {/*    <Form.Select onChange={(e) => handleChange_PlotConfig_DEFAULT_(e, "x")}*/}
              {/*                 value={dataframePlotConfig._DEFAULT_.config.x}*/}
              {/*                 aria-label="Default select example">*/}
              {/*      <option value="_disabled_" disabled="disabled">X</option>*/}
              {/*      {dataframePlotConfig.COLUMNS.map((value, index) => {*/}
              {/*        return <option key={index} value={value}>{value}</option>*/}
              {/*      })}*/}
              {/*    </Form.Select>*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}
              {/*<Col lg={6} xl={6}>*/}
              {/*  <Form.Group controlId={"dataframe-plot.default.y"}>*/}
              {/*    <Form.Label><Trans i18nKey={"y"} /></Form.Label>*/}
              {/*    <Form.Select onChange={(e) => handleChange_PlotConfig_DEFAULT_(e, "y")}*/}
              {/*                 value={dataframePlotConfig._DEFAULT_.config.y}*/}
              {/*                 aria-label="Default select example">*/}
              {/*      <option value="_disabled_" disabled="disabled">Y</option>*/}
              {/*      {dataframePlotConfig.COLUMNS.map((value, index) => {*/}
              {/*        return <option key={index} value={value}>{value}</option>*/}
              {/*      })}*/}
              {/*    </Form.Select>*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}


              {/*<Col lg={6} xl={6}>*/}
              {/*  <Form.Group controlId={"dataframe-plot.default.values"}>*/}
              {/*    <Form.Label><Trans i18nKey={"values"} /></Form.Label>*/}
              {/*    <Form.Control type="text"*/}
              {/*                  placeholder={t("Values")}*/}
              {/*                  autoComplete="off"*/}
              {/*                  onChange={(e) => handleChange_PlotConfig_DEFAULT_(e, "values")}*/}
              {/*                  value={dataframePlotConfig._DEFAULT_.config.values} />*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}
              {/*<Col lg={6} xl={6}>*/}
              {/*  <Form.Group controlId={"dataframe-plot.default.labels"}>*/}
              {/*    <Form.Label><Trans i18nKey={"labels"} /></Form.Label>*/}
              {/*    <Form.Control type="text"*/}
              {/*                  placeholder={t("Labels")}*/}
              {/*                  autoComplete="off"*/}
              {/*                  onChange={(e) => handleChange_PlotConfig_DEFAULT_(e, "labels")}*/}
              {/*                  value={dataframePlotConfig._DEFAULT_.config.labels} />*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}
              <hr className={'mt-3 mb-3'} />

              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.TIME_SERIES_PLOTS &&
                <>
                  <Col lg={12} xl={12}>
                    {!isDataFrameValidForIndex() &&
                      <p className="text-warning">
                        <Trans i18nKey={'Este dataframe no permite una visualización adecuada al no cumplir la condición de una característica con valores únicos'} />
                      </p>
                    }
                  </Col>
                  <Col lg={12} xl={12}>
                    <Form.Group controlId={'dataframe-plot.time_series_plots.index'}>
                      <Form.Label><Trans i18nKey={'Index'} /></Form.Label>
                      <Form.Select onChange={(e) => handleChange_PlotConfig_TimeSeries(e, 'index')}
                                   value={dataframePlotConfig.TIME_SERIES_PLOTS.config.index}
                                   aria-label="Default select example">
                        <option value="_disabled_" disabled="disabled">Index</option>
                        {columnsValidForIndex().map((value, index) => {
                          return <option key={index} value={value}>{value}</option>
                        })}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        <Trans i18nKey={'El indice seleccionado debe contener una serie única y no debe seleccionar el índice junto a las columnas a mostrar'} />
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </>
              }
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.VIOLIN_PLOTS && <>
                {/*TODO*/}
              </>}
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.BOX_PLOTS && <>
                {/*TODO*/}
              </>}
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.PIE_CHARTS &&
                <>
                  <Form.Group controlId={'dataframe-plot-index'}>
                    <Form.Label><Trans i18nKey={'Labels'} /></Form.Label>
                    <Form.Select onChange={(e) => handleChange_PlotConfig_PieCharts(e, 'labels')}
                                 value={dataframePlotConfig.PIE_CHARTS.config.labels}
                                 aria-label="Default select example">
                      <option value="_disabled_" disabled="disabled">Labels</option>
                      {dataframePlotConfig.COLUMNS.map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                      })}
                    </Form.Select>
                  </Form.Group>
                </>
              }

              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.HISTOGRAMS && <>
                {/*TODO*/}
              </>}
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.SCATTER_PLOTS && <>
                {/*TODO*/}
              </>}
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.BAR_CHARTS && <>
                {/*TODO*/}
              </>}
              {dataframePlotConfig.PLOT_ENABLE === E_PLOTS.LINE_CHARTS && <>
                {/*TODO*/}
              </>}

            </Row>
          </Container>
        </Form>

      </Modal.Body>
    </Modal>
  </>
}