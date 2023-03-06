import { alertError } from "../utils/alertHelper";
import * as tf from "@tensorflow/tfjs";

export function getClassesFromDataSet(dataSet) {
  try {
    let dataAux = []
    const typePos = dataSet.data[0].length - 1
    for (let i = 0; i <= typePos; i++) {
      dataAux.push([])
    }

    for (const array of dataSet.data) {
      for (let index = 0; index <= typePos; index++) {
        dataAux[index].push(array[index])
      }
    }

    // Pasamos los atributos a identificadores
    // Por columna (atributo) vamos Mapa con K = el valor del atributo y V = ID del atributo
    const indexDataAux = []
    for (let i = 0; i <= typePos; i++) {
      const mySet = new Set(dataAux[i])
      let mapaAux = new Map()
      let j = 0
      for (const [element] of mySet.entries()) {
        mapaAux.set(element, j)
        j++
      }
      indexDataAux.push(mapaAux)
    }

    dataAux = []
    for (const array of dataSet.data) {
      let aux = []
      for (let index = 0; index <= typePos; index++) {
        aux.push(indexDataAux[index].get(array[index]))
      }
      dataAux.push(aux)
    }

    const targetData = []
    for (let val of indexDataAux[typePos].keys()) {
      targetData.push(val)
    }
    return [dataAux, targetData, indexDataAux]
  } catch (error) {
    console.error(error)
  }
}

export function convertToTensors(data, targets, testSize, numClasses) {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error('data and split have different numbers of examples');
  }

  // Randomly shuffle `data` and `targets`.
  const indices = [];
  for (let i = 0; i < numExamples; ++i) {
    indices.push(i);
  }
  tf.util.shuffle(indices);

  const shuffledData = [];
  const shuffledTargets = [];
  for (let i = 0; i < numExamples; ++i) {
    shuffledData.push(data[indices[i]]);
    shuffledTargets.push(targets[indices[i]]);
  }

  // Split the data into a training set and a tet set, based on `testSplit`.
  const numTestExamples = Math.round(numExamples * testSize);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = shuffledData[0].length;

  // Create a 2D `tf.Tensor` to hold the feature data.
  const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), numClasses);

  // Split the data into training and test sets, using `slice`.
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, numClasses]);
  const yTest = ys.slice([0, 0], [numTestExamples, numClasses]);
  return [xTrain, yTrain, xTest, yTest];
}

export function trainTestSplit(data, classes, testSize) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetByClass = [];
    for (let i = 0; i < classes.length; i++) {
      dataByClass.push([]);
      targetByClass.push([]);
    }

    for (const example of data) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);
      dataByClass[target].push(data);
      targetByClass[target].push(target);
    }

    const xTrains = [], yTrains = [], xTests = [], yTests = [];
    for (let i = 0; i < classes.length; i++) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(dataByClass[i], targetByClass[i], testSize, classes.length);
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