// 0 - 1 --> 0 - 100
const DEFAULT_LEARNING_RATE = 1
// 1 - Inf(1000)
const DEFAULT_NUMBER_OF_EPOCHS = 5
// 0 - 1 --> 0 - 100
const DEFAULT_TEST_SIZE = 30
// TYPE_OPTIMIZER.key
const DEFAULT_ID_OPTIMIZER = 'train-rmsprop'
// TYPE_LOSSES.key
const DEFAULT_ID_LOSS = 'losses-meanSquaredError'
// TYPE_METRICS.key
const DEFAULT_ID_METRICS = ['metrics-meanAbsoluteError', 'metrics-meanSquaredError']
// 
const DEFAULT_LAYERS = [
  { is_disabled: false, units: 20, activation: 'relu'    },
  { is_disabled: false, units: 20, activation: 'sigmoid' },
  { is_disabled: true,  units: 1,  activation: 'linear'  },
]

const LIST_TRANSFORMATIONS = [
  { value: 'int32',         i18n: 'int32'         },
  { value: 'float32',       i18n: 'float32'       },
  { value: 'string',        i18n: 'string'        },
  { value: 'label-encoder', i18n: 'label-encoder' },
  { value: 'drop',          i18n: 'drop'          },
]

export {
  DEFAULT_LEARNING_RATE,
  DEFAULT_NUMBER_OF_EPOCHS,
  DEFAULT_TEST_SIZE,

  DEFAULT_ID_OPTIMIZER,
  DEFAULT_ID_LOSS,
  DEFAULT_ID_METRICS,

  DEFAULT_LAYERS,

  LIST_TRANSFORMATIONS
}