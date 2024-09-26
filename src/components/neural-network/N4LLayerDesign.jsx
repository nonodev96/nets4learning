import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Form } from 'react-bootstrap'

import { VERBOSE } from '@/CONSTANTS'
import { NEURAL_NETWORK_MODES, NeuralNetwork } from './NeuralNetwork'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

export default function N4LLayerDesign({ layers, show = true, glossary_action = '', manual_action = '', actions = [] }) {

  const prefix = 'pages.playground.generator.'
  const { t } = useTranslation()

  const [mode, setMode] = useState(NEURAL_NETWORK_MODES.COMPACT)

  const handleChange_mode = (e) => {
    setMode(e.target.value)
  }

  if (VERBOSE) console.debug('render N4LLayerDesign')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'layer-design'} /></h3>
        <div className={'ms-3'}>
          <Form.Group controlId={'mode'}>
            <Form.Select 
              disabled={show === false}
              aria-label={t(prefix + 'neural_network_modes.title')}
              size={'sm'}
              defaultValue={NEURAL_NETWORK_MODES.COMPACT}
              onChange={(e) => handleChange_mode(e)}>
              <option value={NEURAL_NETWORK_MODES.COMPACT}>{t(prefix + 'neural_network_modes.compact')}</option>
              <option value={NEURAL_NETWORK_MODES.EXTEND}>{t(prefix + 'neural_network_modes.extend')}</option>
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body id={'LinearRegressionLayerDesign'}>
        {show && <>
        <NeuralNetwork id_parent={'vis-network'}
          layers={layers}
          mode={mode} />
        </>}
        {!show && <>
          <WaitingPlaceholder i18nKey_title={'pages.playground.generator.waiting-for-process'} />
        </>}
      </Card.Body>
      {(actions.length > 0 || glossary_action !== '' || manual_action !== '' ) && <>
        <Card.Footer className={'text-end'}>
          {actions.length > 0 && <>
            <ol style={{listStyleType: 'none'}} className='text-muted mb-0'>
              {actions.map((action, index) => <li key={index}> {action} </li>)}
            </ol>
          </>}
          {glossary_action !== '' &&
            <p className={'text-muted mb-0 pb-0'}>
              <Trans i18nKey={'more-information-in-link'}
                components={{
                  link1: <Link className={'text-info'}
                    to={{
                      pathname: '/glossary/',
                      state   : {
                        action: glossary_action,
                      },
                    }} />,
                }} />
            </p>}
          {manual_action !== '' &&
            <p className={'text-muted mb-0 pb-0'}>
              <Trans i18nKey={'more-information-in-tutorial'}
                components={{
                  link1: <Link className={'text-info'}
                    to={{
                      pathname: '/manual/',
                      state   : {
                        action: manual_action,
                      },
                    }} />,
                }} />
            </p>
          }
        </Card.Footer>
      </>}
    </Card>
  </>
}

