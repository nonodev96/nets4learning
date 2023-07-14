import React, { useContext } from 'react'
import { Table, Card , Button} from 'react-bootstrap'
import { Trans } from 'react-i18next'
import * as tfvis from '@tensorflow/tfjs-vis'

import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionTableModels () {
  const prefix = 'generator.table-models.'
  const { listModels } = useContext(LinearRegressionContext)

  const handleClick_CloseVisor = () => {
    tfvis.visor().close()
  }
  const handleClick_OpenVisor = () => {
    tfvis.visor().open()
  }


  const handleClick_DownloadGeneratedModel = ({ model, idMODEL }) => {
    model.save('downloads://lr-model-' + idMODEL)
  }

  console.debug('render LinearRegressionTableModels')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center'}>
        <h3><Trans i18nKey={prefix + 'list-models-generated'} /> | {listModels.length}</h3>

        <Button variant={'outline-primary'}
                className={'ms-3'}
                size={'sm'}
                onClick={handleClick_OpenVisor}>
          <Trans i18nKey={prefix + 'open-visor'} />
        </Button>
        <Button variant={'outline-primary'}
                className={'ms-1'}
                size={'sm'}
                onClick={handleClick_CloseVisor}>
          <Trans i18nKey={prefix + 'close-visor'} />
        </Button>
      </Card.Header>
      <Card.Body>
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
            <th><Trans i18nKey={prefix + 'features'} /></th>
            <th><Trans i18nKey={prefix + 'download'} /></th>
          </tr>
          </thead>

          <tbody>
          {listModels.map((value, index) => {
            return <tr key={index}>
              <td>{value.params_training.learning_rate * 100}%</td>
              <td>{value.params_training.test_size * 100}%</td>
              <td>{value.params_training.n_of_epochs}</td>
              <td>{value.params_training.id_optimizer}</td>
              <td>{value.params_training.id_loss}</td>
              <td>{value.params_training.list_id_metrics.join(', ')}</td>
              <td>
                {value
                  .list_layers
                  .map((value, index) => {
                    return (
                      <span key={index} style={{ fontFamily: 'monospace' }}>
                        <small>{value.units.toString().padStart(2, '0')} - {value.activation}</small><br />
                      </span>
                    )
                  })}
              </td>
              <td>
                <span style={{ fontFamily: 'monospace' }}>X:</span> {value.feature_selector.x_name} <br />
                <span style={{ fontFamily: 'monospace' }}>Y:</span> {value.feature_selector.y_name}
              </td>
              <td>
                <Button variant={'outline-primary'}
                        size={'sm'}
                        onClick={() => handleClick_DownloadGeneratedModel(value)}>
                  <Trans i18nKey={prefix + 'download'} />
                </Button>
              </td>
            </tr>
          })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </>
}