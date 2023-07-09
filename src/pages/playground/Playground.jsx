import './Playground.css'
import React from 'react'
import { useParams } from 'react-router'

import NotFoundPage from '../notFound/NotFoundPage'

import TabularClassification from './0_TabularClassification/TabularClassification'
import ModelReviewTabularClassification from './0_TabularClassification/ModelReviewTabularClassification'

import LinearRegression from './1_LinearRegression/LinearRegression'
import ModelReviewLinearRegression from './1_LinearRegression/ModelReviewLinearRegression'

import ModelReviewObjectDetection from './2_ObjectDetection/ModelReviewObjectDetection'

import ImageClassification from './3_ImageClassification/ImageClassification'
import ModelReviewImageClassification from './3_ImageClassification/ModelReviewImageClassification'

import { LinearRegressionProvider } from '@context/LinearRegressionContext'

export default function Playground () {
  const { id, option, example } = useParams()

  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case '0': {
        if (option === '0') {
          return <ModelReviewTabularClassification dataset={example} />
        } else {
          return <TabularClassification dataset={example} />
        }
      }
      case '1': {
        if (option === '0') {
          return <ModelReviewLinearRegression dataset={example} />
        } else {
          return <LinearRegressionProvider><LinearRegression dataset_id={example} /></LinearRegressionProvider>
        }
      }
      case '2': {
        return <ModelReviewObjectDetection dataset={example} />
      }
      case '3': {
        if (option === '0') {
          return <ModelReviewImageClassification dataset={example} />
        } else {
          return <ImageClassification dataset={example} />
        }
      }
      default:
        return <NotFoundPage />
    }
  }

  return (
    <>
      <main className={'mb-3'} data-title={'Playground'} data-testid={'Test-Playground'}>
        {Print_HTML_Model_View()}
      </main>
    </>
  )
}

