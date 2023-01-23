import * as tf from "@tensorflow/tfjs";

export const IRIS_CLASSES = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"];
const IRIS_NUM_CLASSES = IRIS_CLASSES.length;

//http://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data
export const IRIS_DATA = [
  [5.1, 3.5, 1.4, 0.2, 0],
  [4.9, 3.0, 1.4, 0.2, 0],
  [4.7, 3.2, 1.3, 0.2, 0],
  [4.6, 3.1, 1.5, 0.2, 0],
  [5.0, 3.6, 1.4, 0.2, 0],
  [5.4, 3.9, 1.7, 0.4, 0],
  [4.6, 3.4, 1.4, 0.3, 0],
  [5.0, 3.4, 1.5, 0.2, 0],
  [4.4, 2.9, 1.4, 0.2, 0],
  [4.9, 3.1, 1.5, 0.1, 0],
  [5.4, 3.7, 1.5, 0.2, 0],
  [4.8, 3.4, 1.6, 0.2, 0],
  [4.8, 3.0, 1.4, 0.1, 0],
  [4.3, 3.0, 1.1, 0.1, 0],
  [5.8, 4.0, 1.2, 0.2, 0],
  [5.7, 4.4, 1.5, 0.4, 0],
  [5.4, 3.9, 1.3, 0.4, 0],
  [5.1, 3.5, 1.4, 0.3, 0],
  [5.7, 3.8, 1.7, 0.3, 0],
  [5.1, 3.8, 1.5, 0.3, 0],
  [5.4, 3.4, 1.7, 0.2, 0],
  [5.1, 3.7, 1.5, 0.4, 0],
  [4.6, 3.6, 1.0, 0.2, 0],
  [5.1, 3.3, 1.7, 0.5, 0],
  [4.8, 3.4, 1.9, 0.2, 0],
  [5.0, 3.0, 1.6, 0.2, 0],
  [5.0, 3.4, 1.6, 0.4, 0],
  [5.2, 3.5, 1.5, 0.2, 0],
  [5.2, 3.4, 1.4, 0.2, 0],
  [4.7, 3.2, 1.6, 0.2, 0],
  [4.8, 3.1, 1.6, 0.2, 0],
  [5.4, 3.4, 1.5, 0.4, 0],
  [5.2, 4.1, 1.5, 0.1, 0],
  [5.5, 4.2, 1.4, 0.2, 0],
  [4.9, 3.1, 1.5, 0.1, 0],
  [5.0, 3.2, 1.2, 0.2, 0],
  [5.5, 3.5, 1.3, 0.2, 0],
  [4.9, 3.1, 1.5, 0.1, 0],
  [4.4, 3.0, 1.3, 0.2, 0],
  [5.1, 3.4, 1.5, 0.2, 0],
  [5.0, 3.5, 1.3, 0.3, 0],
  [4.5, 2.3, 1.3, 0.3, 0],
  [4.4, 3.2, 1.3, 0.2, 0],
  [5.0, 3.5, 1.6, 0.6, 0],
  [5.1, 3.8, 1.9, 0.4, 0],
  [4.8, 3.0, 1.4, 0.3, 0],
  [5.1, 3.8, 1.6, 0.2, 0],
  [4.6, 3.2, 1.4, 0.2, 0],
  [5.3, 3.7, 1.5, 0.2, 0],
  [5.0, 3.3, 1.4, 0.2, 0],
  [7.0, 3.2, 4.7, 1.4, 1],
  [6.4, 3.2, 4.5, 1.5, 1],
  [6.9, 3.1, 4.9, 1.5, 1],
  [5.5, 2.3, 4.0, 1.3, 1],
  [6.5, 2.8, 4.6, 1.5, 1],
  [5.7, 2.8, 4.5, 1.3, 1],
  [6.3, 3.3, 4.7, 1.6, 1],
  [4.9, 2.4, 3.3, 1.0, 1],
  [6.6, 2.9, 4.6, 1.3, 1],
  [5.2, 2.7, 3.9, 1.4, 1],
  [5.0, 2.0, 3.5, 1.0, 1],
  [5.9, 3.0, 4.2, 1.5, 1],
  [6.0, 2.2, 4.0, 1.0, 1],
  [6.1, 2.9, 4.7, 1.4, 1],
  [5.6, 2.9, 3.6, 1.3, 1],
  [6.7, 3.1, 4.4, 1.4, 1],
  [5.6, 3.0, 4.5, 1.5, 1],
  [5.8, 2.7, 4.1, 1.0, 1],
  [6.2, 2.2, 4.5, 1.5, 1],
  [5.6, 2.5, 3.9, 1.1, 1],
  [5.9, 3.2, 4.8, 1.8, 1],
  [6.1, 2.8, 4.0, 1.3, 1],
  [6.3, 2.5, 4.9, 1.5, 1],
  [6.1, 2.8, 4.7, 1.2, 1],
  [6.4, 2.9, 4.3, 1.3, 1],
  [6.6, 3.0, 4.4, 1.4, 1],
  [6.8, 2.8, 4.8, 1.4, 1],
  [6.7, 3.0, 5.0, 1.7, 1],
  [6.0, 2.9, 4.5, 1.5, 1],
  [5.7, 2.6, 3.5, 1.0, 1],
  [5.5, 2.4, 3.8, 1.1, 1],
  [5.5, 2.4, 3.7, 1.0, 1],
  [5.8, 2.7, 3.9, 1.2, 1],
  [6.0, 2.7, 5.1, 1.6, 1],
  [5.4, 3.0, 4.5, 1.5, 1],
  [6.0, 3.4, 4.5, 1.6, 1],
  [6.7, 3.1, 4.7, 1.5, 1],
  [6.3, 2.3, 4.4, 1.3, 1],
  [5.6, 3.0, 4.1, 1.3, 1],
  [5.5, 2.5, 4.0, 1.3, 1],
  [5.5, 2.6, 4.4, 1.2, 1],
  [6.1, 3.0, 4.6, 1.4, 1],
  [5.8, 2.6, 4.0, 1.2, 1],
  [5.0, 2.3, 3.3, 1.0, 1],
  [5.6, 2.7, 4.2, 1.3, 1],
  [5.7, 3.0, 4.2, 1.2, 1],
  [5.7, 2.9, 4.2, 1.3, 1],
  [6.2, 2.9, 4.3, 1.3, 1],
  [5.1, 2.5, 3.0, 1.1, 1],
  [5.7, 2.8, 4.1, 1.3, 1],
  [6.3, 3.3, 6.0, 2.5, 2],
  [5.8, 2.7, 5.1, 1.9, 2],
  [7.1, 3.0, 5.9, 2.1, 2],
  [6.3, 2.9, 5.6, 1.8, 2],
  [6.5, 3.0, 5.8, 2.2, 2],
  [7.6, 3.0, 6.6, 2.1, 2],
  [4.9, 2.5, 4.5, 1.7, 2],
  [7.3, 2.9, 6.3, 1.8, 2],
  [6.7, 2.5, 5.8, 1.8, 2],
  [7.2, 3.6, 6.1, 2.5, 2],
  [6.5, 3.2, 5.1, 2.0, 2],
  [6.4, 2.7, 5.3, 1.9, 2],
  [6.8, 3.0, 5.5, 2.1, 2],
  [5.7, 2.5, 5.0, 2.0, 2],
  [5.8, 2.8, 5.1, 2.4, 2],
  [6.4, 3.2, 5.3, 2.3, 2],
  [6.5, 3.0, 5.5, 1.8, 2],
  [7.7, 3.8, 6.7, 2.2, 2],
  [7.7, 2.6, 6.9, 2.3, 2],
  [6.0, 2.2, 5.0, 1.5, 2],
  [6.9, 3.2, 5.7, 2.3, 2],
  [5.6, 2.8, 4.9, 2.0, 2],
  [7.7, 2.8, 6.7, 2.0, 2],
  [6.3, 2.7, 4.9, 1.8, 2],
  [6.7, 3.3, 5.7, 2.1, 2],
  [7.2, 3.2, 6.0, 1.8, 2],
  [6.2, 2.8, 4.8, 1.8, 2],
  [6.1, 3.0, 4.9, 1.8, 2],
  [6.4, 2.8, 5.6, 2.1, 2],
  [7.2, 3.0, 5.8, 1.6, 2],
  [7.4, 2.8, 6.1, 1.9, 2],
  [7.9, 3.8, 6.4, 2.0, 2],
  [6.4, 2.8, 5.6, 2.2, 2],
  [6.3, 2.8, 5.1, 1.5, 2],
  [6.1, 2.6, 5.6, 1.4, 2],
  [7.7, 3.0, 6.1, 2.3, 2],
  [6.3, 3.4, 5.6, 2.4, 2],
  [6.4, 3.1, 5.5, 1.8, 2],
  [6.0, 3.0, 4.8, 1.8, 2],
  [6.9, 3.1, 5.4, 2.1, 2],
  [6.7, 3.1, 5.6, 2.4, 2],
  [6.9, 3.1, 5.1, 2.3, 2],
  [5.8, 2.7, 5.1, 1.9, 2],
  [6.8, 3.2, 5.9, 2.3, 2],
  [6.7, 3.3, 5.7, 2.5, 2],
  [6.7, 3.0, 5.2, 2.3, 2],
  [6.3, 2.5, 5.0, 1.9, 2],
  [6.5, 3.0, 5.2, 2.0, 2],
  [6.2, 3.4, 5.4, 2.3, 2],
  [5.9, 3.0, 5.1, 1.8, 2],
];

export const CAR_CLASSES = ["unacc", "acc", "good", "vgood"]
export const CAR_DATA_CLASSES = [
  ["vhigh", "high", "med", "low"],
  ["vhigh", "high", "med", "low"],
  ["2", "3", "4", "5more"],
  ["2", "4", "more"],
  ["small", "med", "big"],
  ["low", "med", "high"]
]

function convertToTensors(data, targets, testSplit) {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error("data and split have different numbers of examples");
  }

  // Split the data into a training set and a tet set, based on `testSplit`.
  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = data[0].length;

  // Create a `tf.Tensor` to hold the feature data.
  //var dataByClass = tf.oneHot(dataByClass2, 27);
  const xs = tf.tensor2d(data, [numExamples, xDims]);

  // console.log(targets)
  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(targets).toInt(), IRIS_NUM_CLASSES);

  // Split the data into training and test sets, using `slice`.
  // console.log("Este es el xTrain dentro del convert to tensors", data, xDims)
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, IRIS_NUM_CLASSES]);
  const yTest = ys.slice([0, 0], [numTestExamples, IRIS_NUM_CLASSES]);
  return [xTrain, yTrain, xTest, yTest];
}

export function getIrisData(testSplit) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetByClass = [];
    for (let i = 0; i < IRIS_CLASSES.length; i++) {
      dataByClass.push([]);
      targetByClass.push([]);
    }
    for (const example of IRIS_DATA) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);
      dataByClass[target].push(data);
      targetByClass[target].push(target);
    }
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < IRIS_CLASSES.length; i++) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(
        dataByClass[i],
        targetByClass[i],
        testSplit
      );
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
    const test1 = xTrains;
    const test2 = tf.concat(xTrains, concatAxis);
    console.log(test1);
    console.log(test2);
    return [
      tf.concat(xTrains, concatAxis),
      tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis),
      tf.concat(yTests, concatAxis),
    ];
  });
}

export function getData(testSplit, classes, data) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetByClass = [];
    for (let i = 0; i < classes.length; i++) {
      dataByClass.push([]);
      targetByClass.push([]);
    }
    for (const example of data) {
      const target = example[example.length - 1];
      // const posTarget=classes.findIndex(classes => classes === target);
      const data = example.slice(0, example.length - 1);
      dataByClass[target].push(data);
      targetByClass[target].push(target);
    }
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < classes.length; i++) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(
        dataByClass[i],
        targetByClass[i],
        testSplit
      );
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
    return [
      tf.concat(xTrains, concatAxis),
      tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis),
      tf.concat(yTests, concatAxis),
    ];
  });
}

async function trainModel(xTrain, yTrain, xTest, yTest, verbose) {
  // https://www.tensorflow.org/js/guide/models_and_layers
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [xTrain.shape[1]],
    // TODO CHECK
    units: 10,
    activation: "sigmoid",
  }));

  model.add(tf.layers.dense({
    // TODO CHECK
    units: 3,
    activation: "softmax"
  }));

  const learningRate = 0.01;
  const numberOfEpoch = 40;
  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossEntropy",
    metrics: ["accuracy"],
  });

  const history = await model.fit(xTrain, yTrain, {
    epochs: numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if (verbose)
          document.getElementById("demo").innerHTML += `<p>Epoch: ${epoch} Logs:${logs.loss}</p>`;
        await tf.nextFrame();
      },
    },
  });
  return model;
}

export default async function doIris(testSplit, verbose) {

  const [xTrain, yTrain, xTest, yTest] = getIrisData(testSplit);
  return await trainModel(xTrain, yTrain, xTest, yTest)
}

// TODO: comprobar para que es esto
async function createArchitecture(type, learningRate, numberOfEpoch, optimizer, shape) {
  const model = type;
  model.add(
    tf.layers.dense({
      units: 10,
      activation: "sigmoid",
      inputShape: [shape],
    })
  );

  model.add(tf.layers.dense({
    units: 3,
    activation: "softmax"
  }));

  const lR = learningRate;
  const nOE = numberOfEpoch;
  const opt = optimizer;

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossEntropy",
    metrics: ["accuracy"],
  });
}

