import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from 'react-joyride'
import { delay } from '../../../../utils/utils'

export default class I_DATASETS_LINEAR_REGRESSION {
  _KEY = ''
  URL_DATASET = ''
  i18n_TITLE = ''

  constructor (_t, _setAccordionActive) {
    this.t = _t
    this.setAccordionActive = _setAccordionActive
  }

  DESCRIPTION () {
    return <></>
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  LAYERS () {

  }

  COMPILE () {

  }

  /**
   * @typedef {Object} CustomPreprocessDataset_t
   * @property {string} column_name
   * @property {string} column_transform
   *
   * @typedef {Object} CustomDatasetInfo_t
   * @property {string} csv
   * @property {string} info
   * @property {string} path
   * @property {dataframe} dataframe_original
   * @property {dataframe} dataframe_processed
   * @property {boolean} isDatasetProcessed
   * @property {Array<CustomPreprocessDataset_t>} dataframe_transforms
   *
   * @typedef {Object} CustomDatasets_t
   * @property {string} datasets_path
   *
   * @return {Object<CustomDatasets_t>}
   */
  async DATASETS () {
    return {
      datasets     : [],
      datasets_path: ''
    }
  }

  /**
   *
   * callback: (e) => {
   *   e.action    : "start" | "update",
   *   e.controlled: boolean,
   *   e.index     : number,
   *   e.lifecycle : "init" | "ready" | "beacon" | "tooltip" | "complete",
   *   e.size      : 3,
   *   e.status    : "running",
   *   e.type      :"tour:start"
   * }
   *
   * @return {{
   *    run       : boolean,
   *    continuous: boolean,
   *    steps     : Array<{content: string, target: string}>
   * }}
   * @constructor
   */
  JOYRIDE () {
    const handleJoyrideCallback = async (data) => {
      const { action, lifecycle, status, type, step } = data
      const { target } = step
      // const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1)

      if (([ACTIONS.UPDATE]).includes(action) && ([LIFECYCLE.TOOLTIP]).includes(lifecycle)) {
        switch (target) {
          case '.joyride-step-1-manual': {
            this.setAccordionActive(['manual'])
            break
          }
          case '.joyride-step-2-dataset-info': {
            this.setAccordionActive(['manual', 'dataset_info'])
            break
          }
          default: {
            console.error('Error, option not valid')
            break
          }
        }
        await delay(500)
        window.dispatchEvent(new Event('resize'))

      } else if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {

      } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {

      }
    }
    // const prefix = "datasets-models.1-linear-regression.joyride."
    return {
      run                  : true,
      continuous           : true,
      handleJoyrideCallback: handleJoyrideCallback,
      steps                : [
        {
          title    : this.t('Manual'),
          content  : this.t('This is my awesome feature!'),
          target   : '.joyride-step-1-manual',
          placement: 'top',
        },
        {
          title    : this.t('Dataset info'),
          content  : 'This another awesome feature!',
          target   : '.joyride-step-2-dataset-info',
          placement: 'top',
        },
        {
          title    : this.t('Dataset'),
          content  : 'This another awesome feature!',
          target   : '.joyride-step-3-dataset',
          placement: 'top',
        },
        {
          title    : this.t('Layer visualizer'),
          content  : 'This another awesome feature!',
          target   : '.joyride-step-4-layer',
          placement: 'top',
        },
        {
          title    : this.t('Editor layers'),
          target   : '.joyride-step-5-editor-layers',
          content  : 'This another awesome feature!',
          placement: 'right'
        },
        {
          title    : this.t('Editor params'),
          target   : '.joyride-step-6-editor-trainer',
          content  : 'This another awesome feature!',
          placement: 'left-start'
        },
        {
          title    : this.t('List of models'),
          target   : '.joyride-step-7-list-of-models',
          content  : 'This another awesome feature!',
          placement: 'bottom'
        },
        {
          title    : this.t('Predict and visualizer'),
          target   : '.joyride-step-8-predict-visualization',
          content  : 'This another awesome feature!',
          placement: 'top'
        },
        {
          target : '.my-step-1',
          locale : { skip: <strong aria-label="skip">S-K-I-P</strong> },
          content: <>
            <div className="col-sm-4 col-sm-offset-4 embed-responsive embed-responsive-4by3">
              <audio controls className="embed-responsive-item" controlsList="nofullscreen nodownload noremoteplayback">
                <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
              </audio>
            </div>
          </>,
        },
        {
          target : '.my-step-2',
          locale : { skip: <strong aria-label="skip">S-K-I-P</strong> },
          content: <>
            <div className="col-sm-4 col-sm-offset-4 embed-responsive embed-responsive-4by3">
              <audio controls className="embed-responsive-item" controlsList="nofullscreen nodownload noremoteplayback">
                <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
              </audio>
            </div>
          </>,
        },
        {
          target : '.my-step-3',
          locale : { skip: <strong aria-label="skip">S-K-I-P</strong> },
          content: <>
            <div className="col-sm-4 col-sm-offset-4 embed-responsive embed-responsive-4by3">
              <audio controls className="embed-responsive-item" controlsList="nofullscreen nodownload noremoteplayback">
                <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
              </audio>
            </div>
          </>,
        },
      ]
    }
    // return {
    //   debug     : process.env.REACT_APP_ENVIRONMENT === "development",
    //   run       : true,
    //   continuous: false,
    //   steps     : []
    // }
  }
}