import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import { Modal } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function DataFrameCorrelationMatrixModalDescription ({ showDescription, setShowDescription }) {
  const { t } = useTranslation()

  return <>
    <Modal show={showDescription}
           onHide={() => setShowDescription(false)}
           size={'xl'}
           fullscreen={'md-down'}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={`dataframe.correlation-matrix.title`} /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.0'} /></p>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.1'} /></p>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.2'} /></p>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.3'} /></p>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.4'} /></p>
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.5'} /></p>

        <Latex>{'$$ r_{xy} =\n' +
          '  \\frac{ \\sum_{i=1}^{n}(x_i-\\bar{x})(y_i-\\bar{y}) }{%\n' +
          '        \\sqrt{\\sum_{i=1}^{n}(x_i-\\bar{x})^2}\\sqrt{\\sum_{i=1}^{n}(y_i-\\bar{y})^2}} $$'}</Latex>

        <p><Trans i18nKey={'dataframe.correlation-matrix.description.6'} /></p>
        {/*<p><Trans i18nKey={'dataframe.correlation-matrix.description.7'} /></p>*/}
        {/*'$ x_i $'*/}
        <p>
          <Trans i18nKey={'-latex-'}
                 components={{ com: <Latex /> }}
                 values={{ data: '$ PEPE $' }} />
        </p>
        {/*<p><Trans i18nKey={'dataframe.correlation-matrix.description.8'}*/}
        {/*          components={[<Latex>{'$ \\bar{x} $'}</Latex>, <Latex>{'$ \\bar{y} $'}</Latex>]} /></p>*/}
        <p><Trans i18nKey={'dataframe.correlation-matrix.description.9'} /></p>

      </Modal.Body>
    </Modal>
  </>
}
