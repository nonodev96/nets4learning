import React, { useContext } from 'react'
import { Table, Card, Button, Container } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import * as tfvis from '@tensorflow/tfjs-vis'

import LinearRegressionContext from '@context/LinearRegressionContext'
import { VERBOSE } from '@/CONSTANTS'

export default function LinearRegressionTableModels () {
  const prefix = 'generator.table-models.'
  // const { i18n } = useTranslation()
  const { listModels } = useContext(LinearRegressionContext)

  const handleClick_CloseVisor = () => {
    tfvis.visor().close()
  }
  const handleClick_OpenVisor = () => {
    tfvis.visor().open()
  }

  const handleClick_DownloadGeneratedModel = ({ model }, index) => {
    model.save('downloads://lr-model-' + index)
  }

  if (VERBOSE) console.debug('render LinearRegressionTableModels')
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
        <Container fluid={true}>
          <Table size={'sm'} striped={true} bordered={false} hover={true} responsive={'md'}>
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
              // const formatter = new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' })
              // const list = formatter.format([...value.feature_selector.X_features])
              return <tr key={index}>
                <td>{value.params_training.learning_rate}%</td>
                <td>{value.params_training.test_size}%</td>
                <td>{value.params_training.n_of_epochs}</td>
                <td>{value.params_training.id_optimizer}</td>
                <td>
                  <span style={{ fontFamily: 'monospace' }} className={'text-nowrap'}>
                    {value.params_training.id_loss}
                  </span>
                </td>
                <td>
                  {value.params_training.list_id_metrics
                    .map((metric, index2) => {
                      return (
                        <span key={index2} style={{ fontFamily: 'monospace' }} className={'text-nowrap'}>
                          <small>{metric}</small><br />
                        </span>
                      )
                    })
                  }
                </td>
                <td>
                  {value.list_layers
                    .map((value, index2) => {
                      return (
                        <span key={index2} style={{ fontFamily: 'monospace' }} className={'text-nowrap'}>
                        <small>{value.units.toString().padStart(2, '0')} - {value.activation}</small><br />
                      </span>
                      )
                    })}
                </td>
                <td>
                  <span className={'text-nowrap'} style={{ fontFamily: 'monospace' }}>X:</span> {value.feature_selector.X_feature}
                  <br />
                  <span className={'text-nowrap'} style={{ fontFamily: 'monospace' }}>Y:</span> {value.feature_selector.y_target}
                </td>
                <td>
                  <Button variant={'outline-primary'}
                          size={'sm'}
                          onClick={() => handleClick_DownloadGeneratedModel(value, index)}>
                    <Trans i18nKey={prefix + 'download'} />
                  </Button>
                </td>
              </tr>
            })}
            </tbody>
          </Table>
        </Container>
      </Card.Body>
    </Card>
  </>
}