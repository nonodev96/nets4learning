import React, { useContext } from 'react'

import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionDatasetForm () {
  // const prefix = 'pages.playground.generator.'
  const { iModelInfo } = useContext(LinearRegressionContext)

  return <>
    {iModelInfo._KEY}
  </>
}