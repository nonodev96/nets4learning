import { ACTIONS, LIFECYCLE } from 'react-joyride'
import { delay } from '@utils/utils'
import Errors from '@shared/Errors'

export class I_MODEL_TABULAR_CLASSIFICATION {
  TITLE = ''
  LIST_EXAMPLES_RESULTS = []
  LIST_EXAMPLES = []
  DATA_OBJECT = {}
  TABLE_HEADER = []
  CLASSES = []
  FORM = []
  DATA_DEFAULT = {}
  DATA_OBJECT_KEYS = {}
  DATA = [[]]

  constructor (_t) {
    this.t = _t
  }

  loadModel () {
    throw new Error('Error')
  }

  function_v_input (element, index, param) {
    throw new Error('Error')
  }

  DESCRIPTION () {
    return <></>
  }

  HTML_EXAMPLE () {
    return <></>
  }

  JOYRIDE () {
    const handleJoyrideCallback = async (data) => {
      const { action, lifecycle, step/*, status, type*/ } = data
      const { target } = step
      if (
        ([ACTIONS.UPDATE.toString()]).includes(action) &&
        ([LIFECYCLE.TOOLTIP.toString()]).includes(lifecycle)) {
        switch (target) {
          case '.joyride-step-manual': {
            break
          }
          case '.joyride-step-dataset-info': {
            break
          }
          case '.joyride-step-dataset': {
            break
          }
          case '.joyride-step-layer': {
            break
          }
          case '.joyride-step-editor-layers': {
            break
          }
          case '.joyride-step-editor-trainer': {
            break
          }
          case '.joyride-step-list-of-models': {
            break
          }
          case '.joyride-step-classify-visualization': {
            break
          }
          default: {
            console.warn('Error, option not valid')
            break
          }
        }
        await delay(500)
        const isDispatchedEvent = window.dispatchEvent(new Event('resize'))
        if (!isDispatchedEvent) {
          Errors.notDispatchedEvent()
        }
      }
    }

    const prefix = 'datasets-models.0-tabular-classification.joyride.steps.'
    return {
      run                  : true,
      continuous           : true,
      handleJoyrideCallback: handleJoyrideCallback,
      steps                : [
        {
          title    : this.t(prefix + 'manual.title'),
          content  : this.t(prefix + 'manual.content'),
          target   : '.joyride-step-manual',
          placement: 'top',
        },
        {
          title    : this.t(prefix + 'dataset-info.title'),
          content  : this.t(prefix + 'dataset-info.content'),
          target   : '.joyride-step-dataset-info',
          placement: 'top',
        },
        {
          title    : this.t(prefix + 'dataset.title'),
          content  : this.t(prefix + 'dataset.content'),
          target   : '.joyride-step-dataset',
          placement: 'top',
        },
        {
          title    : this.t(prefix + 'layer-visualizer.title'),
          content  : this.t(prefix + 'layer-visualizer.content'),
          target   : '.joyride-step-layer',
          placement: 'top',
        },
        {
          title    : this.t(prefix + 'layer-editor.title'),
          content  : this.t(prefix + 'layer-editor.content'),
          target   : '.joyride-step-editor-layers',
          placement: 'right'
        },
        {
          title    : this.t(prefix + 'params-editor.title'),
          content  : this.t(prefix + 'params-editor.content'),
          target   : '.joyride-step-editor-trainer',
          placement: 'left-start'
        },
        {
          title    : this.t(prefix + 'list-of-models.title'),
          content  : this.t(prefix + 'list-of-models.content'),
          target   : '.joyride-step-list-of-models',
          placement: 'bottom'
        },
        {
          title    : this.t(prefix + 'classify-and-visualizer.title'),
          content  : this.t(prefix + 'classify-and-visualizer.content'),
          target   : '.joyride-step-classify-visualization',
          placement: 'top'
        },
      ]
    }
  }

}

/**
 * @class
 */

/**
 * @abstract
 * @property {function(): JSX.Element} DESCRIPTION
 * @property {function(): JSX.Element} HTML_EXAMPLE
 *
 * @property {Array} [TABLE_HEADER]
 * @property {function(): Promise<>} loadModel
 * @property {function(element: string, index: number, param: string): Promise|Promise<>|string|number} function_v_input
 * @property {Array} CLASSES
 * @property {number} NUM_CLASSES
 * @property {Array} [DATA_CLASSES]
 * @property {object} [DATA_OBJECT]
 * @property {Array<string>} [DATA_OBJECT_KEYS]
 * @property {Object} [DATA_DEFAULT]
 * @property {Array} [DATA_CLASSES_KEYS]
 * @property {Array<Object>} [LIST_EXAMPLES]
 * @property {Array<Object>} [FORM]
 * @property {Array} DATA
 */

/**
 * @interface
 * @static {string} KEY
 * @static {string} TITLE
 * @static {string} URL_MODEL
 * @static {string} URL
 */