const DEFAULT_LEARNING_RATE = 1
const DEFAULT_NUMBER_EPOCHS = 15
const DEFAULT_TEST_SIZE = 10
const DEFAULT_ID_OPTIMIZATION = 'adam'
const DEFAULT_ID_LOSS = 'metrics-categoricalCrossentropy'
const DEFAULT_ID_METRICS = ['categoricalCrossentropy']

const DEFAULT_LAYERS = [
  {
    _class           : 'Conv2D',
    kernelSize       : 3,
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
    filters          : 10,
    strides          : 1,
    activation       : 'relu',
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

export {
  DEFAULT_LAYERS,

  DEFAULT_LEARNING_RATE,
  DEFAULT_NUMBER_EPOCHS,
  DEFAULT_TEST_SIZE,

  DEFAULT_ID_OPTIMIZATION,
  DEFAULT_ID_LOSS,
  DEFAULT_ID_METRICS,
}