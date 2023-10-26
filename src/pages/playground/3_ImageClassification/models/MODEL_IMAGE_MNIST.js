import I_MODEL_IMAGE_CLASSIFICATION from './_model'
import { Trans } from 'react-i18next'

export const LIST_OF_IMAGES_MNIST = [
  '0_new.png',
  '1_new.png',
  '2_new.png',
  '3_new.png',
  '4_new.png',
  '5_new.png',
  '6_new.png',
  '7_new.png',
  '8_new.png',
  '9_new.png'
]
export default class MODEL_IMAGE_MNIST extends I_MODEL_IMAGE_CLASSIFICATION {
  static KEY = 'IMAGE-MNIST'
  TITLE = 'datasets-models.3-image-classifier.mnist.title'
  i18n_TITLE = 'datasets-models.3-image-classifier.mnist.title'

  DESCRIPTION () {
    const prefix = 'datasets-models.3-image-classifier.mnist.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-0'} /></p>
      <p><Trans i18nKey={prefix + 'text-1'} /></p>
      <p><Trans i18nKey={prefix + 'text-2'} /></p>

      <details>
        <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-input.list.0'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-output.list.0'} /></li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@article{deng2012mnist,
  title={The mnist database of handwritten digit images for machine learning research},
  author={Deng, Li},
  journal={IEEE Signal Processing Magazine},
  volume={29},
  number={6},
  pages={141--142},
  year={2012},
  publisher={IEEE}
}
`}
        </pre>
      </details>
    </>
  }

  async TRAIN_MODEL (params) {
    return await TrainMNIST
  }

  DEFAULT_LAYERS () {
    return [
      {
        _class           : 'Conv2D',
        kernelSize       : 5,
        filters          : 10,
        strides          : 1,
        activation       : 'Sigmoid',
        kernelInitializer: 'varianceScaling',
        // Not used because the class is Conv2D
        poolSize: [2, 2],
        strides2: [2, 2]
      },
      {
        _class  : 'MaxPooling2D',
        poolSize: [2, 2],
        strides2: [2, 2],
        // Not used because the class is MaxPooling2D
        kernelSize       : 5,
        filters          : 10,
        strides          : 1,
        activation       : 'Sigmoid',
        kernelInitializer: 'varianceScaling',
      },
      {
        _class           : 'Conv2D',
        kernelSize       : 5,
        filters          : 16,
        strides          : 1,
        activation       : 'relu',
        kernelInitializer: 'varianceScaling',
        // Not used because the class is Conv2D
        poolSize: [2, 2],
        strides2: [2, 2]
      },
      {
        _class  : 'MaxPooling2D',
        poolSize: [2, 2],
        strides2: [2, 2],
        // Not used because the class is MaxPooling2D
        kernelSize       : 5,
        filters          : 16,
        strides          : 1,
        activation       : 'relu',
        kernelInitializer: 'varianceScaling',
      },
    ]
  }
}
