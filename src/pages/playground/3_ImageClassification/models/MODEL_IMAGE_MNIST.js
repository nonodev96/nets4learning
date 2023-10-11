import I_MODEL_IMAGE_CLASSIFICATION from './_model'
import { Trans } from 'react-i18next'

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
}
