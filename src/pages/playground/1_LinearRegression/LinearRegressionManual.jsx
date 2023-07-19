import 'katex/dist/katex.min.css'
import React from 'react'
import { Trans } from 'react-i18next'
import Latex from 'react-latex-next'
import { VERBOSE } from '@/CONSTANTS'

export default function LinearRegressionManual ({ i_model }) {

  const prefixManual = 'pages.playground.1-linear-regression.generator.'

  if(VERBOSE) console.debug('render LinearRegressionManual')
  return <>
    <details>
      <summary className={"n4l-summary"}>Info</summary>
      <main>
        <strong><Trans i18nKey={prefixManual + 'simple-linear-regression'} /><br /></strong>
        <Latex>{'$$ Y = bX + a $$'}</Latex>

        <strong><Trans i18nKey={prefixManual + 'multiple-linear-regression'} /><br /></strong>
        <Latex>{'$$ Y(x_1, x_2, ..., x_n) = w_1 x_1 + w_2 x_2 + ... + w_n x_n + w_0 $$'}</Latex>
      </main>
    </details>
  </>
}