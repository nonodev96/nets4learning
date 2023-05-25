import * as df from "danfojs";
import * as tf from "@tensorflow/tfjs"

/**
 * @implements {I_MODEL_LINEAR_REGRESSION}
 */
export default class MODEL_AUTO_MPG {

  static KEY = "MODEL_AUTO_MPG"
  i18n_TITLE = "datasets-models.1-linear-regression.auto-mpg.title"
  URL = "https://archive.ics.uci.edu/ml/datasets/auto+mpg"

  // constructor() {
  //
  // }


  async dataframe() {
    return df.readCSV(process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/auto-mpg.csv")
  }


  compile() {
    let column_names = ["mpg", "cylinders", "displacement", "horsepower", "weight", "acceleration", "model-year"]


    const loadData = async () => {
      const csvUrl = process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/auto-mpg.csv";
      const csvDataset = await tf.data.csv(
        csvUrl,
        {
          columnConfigs: {
            mpg: {
              isLabel: true
            }
          }
        }
      );

      const numOfColumns = (await csvDataset.columnNames()).length - 1;
      const flattenedDataset = csvDataset.map(({ xs, ys }) => {
        console.log("ayuda", { xs, ys })
        // const values = Object.values(xs);
        // const features = tf.tensor(values.slice(1), [numOfColumns]);
        // const label = tf.tensor1d([ys['mpg']]);
        return { xs: Object.values(xs), ys: Object.values(ys) };
      });

      return { csvDataset: csvDataset, flattenedDataset: flattenedDataset.batch(32) };
    };

    const createModel = (numOfColumns) => {
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [numOfColumns], units: 1 }));
      return model;
    };

    const trainModel = async (model, features, labels) => {
      model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
      const batchSize = 32;
      const epochs = 100;
      return await model.fitDataset(features, labels, {
        batchSize,
        epochs,
        shuffle: true,
      });
    };

    const run = async () => {
      const { csvDataset, flattenedDataset: _ } = await loadData();
      const numOfColumns = (await csvDataset.columnNames()).length - 1;
      console.log(csvDataset)
      const model = createModel(numOfColumns);

      const flattenedDataset = await csvDataset.toArray();
      const features = tf.stack(flattenedDataset.map(({ features }) => features));
      const labels = tf.stack(flattenedDataset.map(({ label }) => label));

      await trainModel(model, features, labels);

      console.log('Training complete!');
    };

    run().then(r => undefined);
  }

  DESCRIPTION() {
    return <>

    </>
  }

  ATTRIBUTE_INFORMATION() {
    return <>

    </>
  }
}