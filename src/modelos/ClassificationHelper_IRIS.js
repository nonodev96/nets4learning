import * as tf from "@tensorflow/tfjs";

export const MODEL_IRIS = {
  KEY              : "IRIS",
  TITLE            : "IRIS - Clasificación de flor iris",
  URL              : "https://archive.ics.uci.edu/ml/datasets/iris",
  DESCRIPTION      : <>
    <p>
      El conjunto de datos de Iris-Data permite detectar que tipo de planta iris es a partir de altitud y longitud de su pétalo y sépalo.
    </p>
    <details>
      <summary>Datos de entrada</summary>
      <ol>
        <li>Longitud del sépalo en cm</li>
        <li>Anchura del sépalo en cm</li>
        <li>Longitud del pétalo en cm</li>
        <li>Anchura del pétalo en cm</li>
      </ol>
    </details>
    <details>
      <summary>Datos de salida</summary>
      <ol>
        <li>Iris Setosa</li>
        <li>Iris Versicolor</li>
        <li>Iris Virginica</li>
      </ol>
    </details>
    <details>
      <summary>Referencias</summary>
      <ol>
        <li><a href="https://archive.ics.uci.edu/ml/datasets/Iris" target="_blank" rel="noreferrer">Conjunto de datos</a></li>
      </ol>
    </details>
  </>,
  HTML_EXAMPLE     : <>
    <p>
      Introduce separado por punto y coma los siguientes valores correspondientes a la planta que se va a evaluar:
      <br/>
      <b>(longitud sépalo;anchura sépalo;longitud petalo;anchura petalo).</b>
    </p>
    <p>Ejemplos:</p>
  </>,
  loadModel        : async function () {
    return await tf.loadLayersModel(process.env.REACT_APP_PATH + "/models/classification/iris/mymodelIris.json")
  },
  function_v_input : async function (element, index, param = "") {
    return parseFloat(element)
  },
  CLASSES          : ["Iris-setosa", "Iris-versicolor", "Iris-virginica"],
  NUM_CLASSES      : 3, // CLASSES.length
  DATA_OBJECT      : { longitud_sepalo: 5.1, anchura_sepalo: 3.5, longitud_petalo: 1.4, anchura_petalo: 0.2 },
  DATA_DEFAULT     : { longitud_sepalo: 5.1, anchura_sepalo: 3.5, longitud_petalo: 1.4, anchura_petalo: 0.2 },
  DATA_OBJECT_KEYS : ["longitud_sepalo", "anchura_sepalo", "longitud_petalo", "anchura_petalo"],
  DATA_CLASSES_KEYS: [
    "Longitud sépalo",
    "Anchura sépalo",
    "Longitud petalo",
    "Anchura petalo"
  ],
  TABLE_HEADER     : [
    "Longitud sépalo",
    "Anchura sépalo",
    "Longitud petalo",
    "Anchura petalo"
  ],
  LIST_EXAMPLES    : [
    { longitud_sepalo: 5.1, anchura_sepalo: 3.5, longitud_petalo: 1.4, anchura_petalo: 0.2 },
    { longitud_sepalo: 6.1, anchura_sepalo: 3.0, longitud_petalo: 4.6, anchura_petalo: 1.4 },
    { longitud_sepalo: 5.8, anchura_sepalo: 2.7, longitud_petalo: 5.1, anchura_petalo: 1.9 },
  ],
  FORM             : [],
  DATA             : [
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
  ]
}

// https://es.wikipedia.org/wiki/Conjunto_de_datos_flor_iris
export function getIrisDataType(id) {
  return MODEL_IRIS.CLASSES[id]
}


// http://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data
//
//
// function iris_getData(testSplitSize) {
//   return tf.tidy(() => {
//     const dataByClass = [];
//     const targetByClass = [];
//     for (let i = 0; i < MODEL_IRIS.CLASSES.length; i++) {
//       dataByClass.push([]);
//       targetByClass.push([]);
//     }
//     for (const example of MODEL_IRIS.DATA) {
//       // el ultimo dato es el objetivo
//       const target = example[example.length - 1];
//       // El resto de 0 a n-1 son los datos
//       const data = example.slice(0, example.length - 1);
//
//       dataByClass[target].push(data);
//       targetByClass[target].push(target);
//     }
//     const xTrains = [];
//     const yTrains = [];
//     const xTests = [];
//     const yTests = [];
//     for (let i = 0; i < MODEL_IRIS.CLASSES.length; i++) {
//       const [xTrain, yTrain, xTest, yTest] = classificationHelper.convertToTensors(dataByClass[i], targetByClass[i], testSplitSize, MODEL_IRIS.CLASSES.length);
//       xTrains.push(xTrain);
//       yTrains.push(yTrain);
//       xTests.push(xTest);
//       yTests.push(yTest);
//     }
//
//     const concatAxis = 0;
//     return [
//       tf.concat(xTrains, concatAxis),
//       tf.concat(yTrains, concatAxis),
//       tf.concat(xTests, concatAxis),
//       tf.concat(yTests, concatAxis),
//     ];
//   });
// }
//
// async function iris_trainModel(xTrain, yTrain, xTest, yTest, verbose) {
//   // https://www.tensorflow.org/js/guide/models_and_layers
//   const model = tf.sequential();
//   model.add(tf.layers.dense({
//     inputShape: [xTrain.shape[1]],
//     units     : 10,
//     activation: "sigmoid",
//   }));
//
//   model.add(tf.layers.dense({
//     units     : 3,
//     activation: "softmax"
//   }));
//
//   const learningRate = 0.01;
//   const numberOfEpoch = 40;
//   const optimizer = tf.train.adam(learningRate);
//   model.compile({
//     optimizer: optimizer,
//     loss     : "categoricalCrossentropy",
//     metrics  : ["accuracy"],
//   });
//
//   const history = await model.fit(xTrain, yTrain, {
//     epochs        : numberOfEpoch,
//     validationData: [xTest, yTest],
//     callbacks     : {
//       onEpochEnd: async (epoch, logs) => {
//         if (verbose) {
//           document.getElementById("demo").innerHTML += `
// <p>EPOCH (${epoch + 1}): </p>
// <ul>
//   <li>Train Accuracy: ${(logs.acc * 100).toFixed(2)}</li>
//   <li>  Val Accuracy: ${(logs.val_acc * 100).toFixed(2)}</li>
// </ul>
// `;
//         }
//         await tf.nextFrame();
//       },
//     },
//   });
//   console.log("History " + history.history.loss[0]);
//
//   return model;
// }
//
//
// export async function doIris(testSplit, verbose) {
//   const [xTrain, yTrain, xTest, yTest] = iris_getData(testSplit);
//   return await iris_trainModel(xTrain, yTrain, xTest, yTest, verbose)
// }
