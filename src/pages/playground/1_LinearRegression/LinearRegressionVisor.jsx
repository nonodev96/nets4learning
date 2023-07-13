import React, { useContext, useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionVisor () {

  const prefix = 'pages.playground.generator.visor.'
  const { t } = useTranslation()

  const { setTmpModel } = useContext(LinearRegressionContext)

  const DEFAULT_VISOR_OPTIONS = { rmse: true, val_rmse: true, mae: true, val_mae: true }
  const [visorOptions, setVisorOptions] = useState(DEFAULT_VISOR_OPTIONS)

  useEffect(() => {
    const params_visor = []
    if (visorOptions.rmse) params_visor.push('rmse')
    if (visorOptions.val_rmse) params_visor.push('val_rmse')
    if (visorOptions.mae) params_visor.push('mae')
    if (visorOptions.val_mae) params_visor.push('val_mae')

    setTmpModel((oldTmpModel) => ({
      ...oldTmpModel,
      params_visor
    }))
  }, [visorOptions, setTmpModel])

  const updateVisorOptions = (key, value) => {
    setVisorOptions((prevState) => {
      const _prevState = Object.assign({}, prevState)
      _prevState[key] = value
      return _prevState
    })
  }

  console.debug('render LinearRegressionVisor')
  return <>
    <Card>
      <Card.Header>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
      </Card.Header>
      <Card.Body>
        <Form.Check type={'checkbox'}
                    label={t(prefix + 'rmse')}
                    checked={visorOptions.rmse}
                    onChange={() => updateVisorOptions('rmse', !visorOptions.rmse)}
                    id={'rmse'}
        />

        <Form.Check type={'checkbox'}
                    label={t(prefix + 'val_rmse')}
                    checked={visorOptions.val_rmse}
                    onChange={() => updateVisorOptions('val_rmse', !visorOptions.val_rmse)}
                    id={'val_rmse'}
        />

        <Form.Check type={'checkbox'}
                    label={t(prefix + 'mae')}
                    checked={visorOptions.mae}
                    onChange={() => updateVisorOptions('mae', !visorOptions.mae)}
                    id={'mae'}
        />

        <Form.Check type={'checkbox'}
                    label={t(prefix + 'val_mae')}
                    checked={visorOptions.val_mae}
                    onChange={() => updateVisorOptions('val_mae', !visorOptions.val_mae)}
                    id={'val_mae'}
        />

      </Card.Body>
    </Card>
  </>
}
