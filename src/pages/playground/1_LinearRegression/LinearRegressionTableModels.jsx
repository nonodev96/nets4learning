import { Table } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import React, { useContext } from 'react'
import LinearRegressionContext from '../../../context/LinearRegressionContext'

export default function LinearRegressionTableModels () {
  const prefix = 'generator.table-models.'
  const { listModels } = useContext(LinearRegressionContext)

  console.log('render LinearRegressionTableModels')
  return <>
    <Table size={'sm'} striped={true} bordered={false} hover={true} responsive={true}>
      <thead>
      <tr>
        <th><Trans i18nKey={prefix + 'learning-rate'} /></th>
        <th><Trans i18nKey={prefix + 'test-size'} /></th>
        <th><Trans i18nKey={prefix + 'n-of-epochs'} /></th>
        <th><Trans i18nKey={prefix + 'id-optimizer'} /></th>
        <th><Trans i18nKey={prefix + 'id-loss'} /></th>
        <th><Trans i18nKey={prefix + 'id-metrics'} /></th>
        <th><Trans i18nKey={prefix + 'layers'} /></th>
      </tr>
      </thead>

      <tbody>
      {listModels.map((item, index) => {
        return <tr key={index}>
          <td>{item.params_training.learning_rate * 100}%</td>
          <td>{item.params_training.test_size * 100}%</td>
          <td>{item.params_training.n_of_epochs}</td>
          <td>{item.params_training.id_optimizer}</td>
          <td>{item.params_training.id_loss}</td>
          <td>{item.params_training.list_id_metrics.join(', ')}</td>
          <td>{item.list_layers.map((value, index) => {
            return (
              <span key={index} style={{ fontFamily: 'monospace' }}>
                <small>{value.units.toString().padStart(2, '0')} - {value.activation}</small><br />
              </span>
            )
          })}</td>
        </tr>
      })}
      </tbody>
    </Table>
  </>
}