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

export {
  DEFAULT_LEARNING_RATE,
  DEFAULT_NUMBER_OF_EPOCHS,
  DEFAULT_TEST_SIZE,

  DEFAULT_ID_OPTIMIZER,
  DEFAULT_ID_LOSS,
  DEFAULT_ID_METRICS,
}