import React, { useCallback, useContext, useEffect, useId } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { lineChartsValidConfig, pieChartsValidConfig, timeSeriesPlotsValidConfig } from '../../core/dataframe/DataFrameUtils'
import DataFramePlotDescription from './DataFramePlotDescription'
import DataFramePlotConfiguration from './DataFramePlotConfiguration'
import DataFramePlotContext from '../_context/DataFramePlotContext'
import { E_PLOTS, LIST_PLOTS } from '../_context/Constants'
import DebugJSON from '../debug/DebugJSON'
import '../../styles/ScrollBar.css'

export default function DataFramePlot ({ dataframe }) {

  const {
    dataFrameLocal,
    setDataFrameLocal,

    dataframePlotConfig,
    setDataframePlotConfig,

    setShowOptions,
    setShowDescription,
  } = useContext(DataFramePlotContext)

  const dataframe_plot_id = useId()

  const init = useCallback(() => {

    // Funciones para inicializar TIME_SERIES_PLOTS
    const _columnsValidFor_TimeSeriesPlots_Index = (_dataframe) => {
      return _dataframe.columns.filter((column) => {
        return _dataframe[column].unique().shape[0] === _dataframe.shape[0]
      })
    }

    const _isDataFrameValidFor_TimeSeriesPlots_Index = (_dataframe) => {
      return _columnsValidFor_TimeSeriesPlots_Index(_dataframe).length > 0
    }

    // Funciones para inicializar PIE_CHARTS
    const _getDataFrame_nUnique_PieCharts_Labels = (_dataframe) => {
      const list = []
      for (const col_name of _dataframe.columns) {
        const col_size = new Set(_dataframe[col_name].values).size
        list.push({ col_name, col_size })
      }
      return list
    }
    const _getDataFrame_Min_nUnique_PieCharts_Labels = (_dataframe) => {
      const list = _getDataFrame_nUnique_PieCharts_Labels(_dataframe)
        .sort((a, b) => {
          return a.col_size - b.col_size
        })
      const min = list[0]
      return { col_name: min.col_name, col_size: min.col_size }
    }
    const _isDataFrameValidFor_PieCharts_Labels = (_dataframe) => {
      return true
    }

    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState.COLUMNS = dataFrameLocal.columns
      if (dataFrameLocal.columns.length > 0) {
        if (_isDataFrameValidFor_TimeSeriesPlots_Index(dataFrameLocal)) {
          _prevState.TIME_SERIES_PLOTS.config.index = _columnsValidFor_TimeSeriesPlots_Index(dataFrameLocal)[0]
        }
        if (_isDataFrameValidFor_PieCharts_Labels(dataFrameLocal)) {
          _prevState.PIE_CHARTS.config.labels = _getDataFrame_Min_nUnique_PieCharts_Labels(dataFrameLocal).col_name
        }
      }
      return _prevState
    })
  }, [dataFrameLocal, setDataframePlotConfig])

  const update_interfaz = useCallback(() => {
    try {
      const layout = {
        title: dataframePlotConfig.LAYOUT.title,
        xaxis: { title: dataframePlotConfig.LAYOUT.x_axis, },
        yaxis: { title: dataframePlotConfig.LAYOUT.y_axis, },
      }
      if (dataframePlotConfig.COLUMNS !== []) {
        const columnsToShow = dataframePlotConfig.COLUMNS.filter(elemento => dataFrameLocal.columns.includes(elemento))
        const sub_df = dataFrameLocal.loc({ columns: columnsToShow })
        switch (dataframePlotConfig.PLOT_ENABLE) {
          case E_PLOTS.BAR_CHARTS:
            // TODO
            sub_df.plot(dataframe_plot_id).bar({ layout })
            break
          case E_PLOTS.BOX_PLOTS:
            sub_df.plot(dataframe_plot_id).box({ layout })
            break
          case E_PLOTS.HISTOGRAMS:
            sub_df.plot(dataframe_plot_id).hist({ layout })
            break
          case E_PLOTS.LINE_CHARTS:
            const { isValidConfig_LineCharts, config_LineCharts } = lineChartsValidConfig(dataFrameLocal, dataframePlotConfig, columnsToShow)
            if (isValidConfig_LineCharts) {
              sub_df.plot(dataframe_plot_id).line({ layout })
            } else {
              console.log('Configuración no valida E_PLOTS.LINE_CHARTS', { config_LineCharts })
            }
            break
          case E_PLOTS.PIE_CHARTS:
            const { isValidConfig_PieCharts, config_PieCharts } = pieChartsValidConfig(dataFrameLocal, dataframePlotConfig, columnsToShow)
            if (isValidConfig_PieCharts) {
              sub_df.plot(dataframe_plot_id).pie({ layout, config: config_PieCharts })
            } else {
              console.log('Configuración no valida E_PLOTS.PIE_CHARTS', { config_PieCharts })
            }
            break
          case E_PLOTS.SCATTER_PLOTS:
            sub_df.plot(dataframe_plot_id).scatter({ layout })
            break
          case E_PLOTS.TIME_SERIES_PLOTS:
            // TODO
            const { isValidConfig_TimeSeries, config_TimeSeries, index } = timeSeriesPlotsValidConfig(dataFrameLocal, dataframePlotConfig, columnsToShow)
            if (isValidConfig_TimeSeries) {
              const sub_sub_df = sub_df.setIndex(index)
              sub_sub_df.plot(dataframe_plot_id).line({ layout })
            } else {
              console.log('Configuración no valida E_PLOTS.TIME_SERIES_PLOTS', { config_TimeSeries, index })
            }
            break
          case E_PLOTS.VIOLIN_PLOTS:
            sub_df.plot(dataframe_plot_id).violin({ layout })
            break
          default: {
            console.error('Error, option not valid')
            break
          }
        }
      }
    } catch (e) {
      console.log({ e })
    }
  }, [
    dataframePlotConfig.PLOT_ENABLE,
    dataframePlotConfig.COLUMNS,
    // dataframePlotConfig.LAYOUT.title,
    // dataframePlotConfig.LAYOUT.x_axis,
    // dataframePlotConfig.LAYOUT.y_axis,
    dataframePlotConfig.TIME_SERIES_PLOTS.config.index,
    dataframePlotConfig.PIE_CHARTS.config.labels,
    dataframe_plot_id, dataFrameLocal])

  useEffect(() => {
    console.debug('useEffect[dataframe, setDataFrameLocal]')
    setDataFrameLocal(dataframe)
  }, [dataframe, setDataFrameLocal])

  useEffect(() => {
    console.debug('useEffect[ init() ]')
    init()
  }, [init])

  useEffect(() => {
    console.debug('useEffect[ update_interfaz() ]')
    update_interfaz()
  }, [update_interfaz])

  const handleChange_Plot = (e) => {
    setDataframePlotConfig({
      ...dataframePlotConfig,
      PLOT_ENABLE: e.target.value
    })
  }

  console.log('render DataFramePlot')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'dataframe-plot.title'} /></h3>
        <div className={'d-flex'}>
          <Form.Group controlId={'plot'}>
            <Form.Select onChange={(e) => handleChange_Plot(e)}
                         aria-label={'plot'}
                         size={'sm'}
                         value={dataframePlotConfig.PLOT_ENABLE}>
              <>{LIST_PLOTS.map((value, index) => (<option key={'option_' + index} value={value}><Trans i18nKey={`dataframe-plot.${value}.title`} /></option>))}</>
            </Form.Select>
          </Form.Group>

          <Button variant="outline-primary" size={'sm'} className={'ms-3'} onClick={() => setShowOptions(true)}>
            <Trans i18nKey={'dataframe-plot.buttons.configuration'} />
          </Button>
          <Button variant="outline-primary" size={'sm'} className={'ms-3'} onClick={() => setShowDescription(true)}>
            <Trans i18nKey={'dataframe-plot.buttons.description'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div id={dataframe_plot_id}></div>
            </Col>
          </Row>
        </Container>
      </Card.Body>

      <Card.Footer>
        <DebugJSON obj={dataframePlotConfig} />
      </Card.Footer>
    </Card>


    <DataFramePlotDescription />
    <DataFramePlotConfiguration />
  </>
}