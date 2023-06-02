import * as df from "danfojs";
import * as tf from "@tensorflow/tfjs"
import * as tfjs from "@tensorflow/tfjs";
import I_MODEL_LINEAR_REGRESSION from "./_model";
import { Trans } from "react-i18next";

export default class MODEL_AUTO_MPG extends I_MODEL_LINEAR_REGRESSION {

  static KEY = "AUTO_MPG"
  static URL = "https://archive.ics.uci.edu/ml/datasets/auto+mpg"
  i18n_TITLE = "datasets-models.1-linear-regression.auto-mpg.title"


  async dataframe() {
    return df.readCSV(process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/auto-mpg.csv")
  }


  compile() {
    // let column_names = ["mpg", "cylinders", "displacement", "horsepower", "weight", "acceleration", "model-year"]


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

      // const numOfColumns = (await csvDataset.columnNames()).length - 1;
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
      model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [numOfColumns] }));
      model.add(tf.layers.dense({ units: 64, activation: "relu" }));
      model.add(tf.layers.dense({ units: 64, activation: "relu" }));
      model.add(tf.layers.dense({ units: 64, activation: "relu" }));
      model.add(tf.layers.dense({ units: 1, activation: "relu" }));
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
      const { csvDataset } = await loadData();
      const numOfColumns = (await csvDataset.columnNames()).length - 1;
      console.log(csvDataset)
      const model = createModel(numOfColumns);

      const flattenedDataset = await csvDataset.toArray();
      const features = tf.stack(flattenedDataset.map(({ features }) => features));
      const labels = tf.stack(flattenedDataset.map(({ label }) => label));

      await trainModel(model, features, labels);

      console.log('Training complete!');
    };

    run().then(() => undefined);
  }

  LAYERS() {
    const inputShape = 7
    const model = tfjs.sequential()
    model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [inputShape] }))
    model.add(tf.layers.dense({ units: 64, activation: "relu" }))
    model.add(tf.layers.dense({ units: 64, activation: "relu" }))
    model.add(tf.layers.dense({ units: 64, activation: "relu" }))
    model.add(tf.layers.dense({ units: 1, activation: "relu" }))
    return model
  }

  COMPILE() {
    const model = tfjs.sequential()
    model.compile({
      optimizer: tf.train.rmsprop(0.01),
      loss     : "mean_squared_error",
      metrics  : ["mean_squared_error", "mean_absolute_error"]
    })
    return model
  }

  DESCRIPTION() {
    const prefix = "datasets-models.1-linear-regression.auto-mpg.description."
    return <>
      <p><Trans i18nKey={prefix + "text-1"} /></p>
      <p><Trans i18nKey={prefix + "text-2"} /></p>
      <p>
        <Trans i18nKey={prefix + "text-link"}
               components={{
                 link1: <a href={"https://archive.ics.uci.edu/ml/datasets/auto+mpg"} target={"_blank"} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + "details-1.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-1.list.1"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.2"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.3"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.4"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.5"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.6"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.7"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.8"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.9"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-2.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-2.list.1"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.2"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.3"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.4"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.5"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.6"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.7"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.8"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.9"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-3.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-3.list.1"} /></li>
        </ol>
      </details>

    </>
  }

  ATTRIBUTE_INFORMATION() {
    return <>

    </>
  }

  JOYRIDE() {
    return {
      run       : true,
      continuous: true,
      callback  : (e) => {
        console.log("callback", e)
      },
      locale    : {
        back : this.t("joyride.back"),
        close: this.t("joyride.close"),
        last : this.t("joyride.last"),
        next : this.t("joyride.next"),
        open : this.t("joyride.open"),
        skip : this.t("joyride.skip")
      },
      style     : {
        options: {
          arrowColor     : '#e3ffeb',
          backgroundColor: '#e3ffeb',
          overlayColor   : 'rgba(79, 26, 0, 0.4)',
          primaryColor   : '#000',
          textColor      : '#004a14',
          width          : 900,
          zIndex         : 1000,
        }
      },
      steps     : [
        {
          target : '.my-step-1',
          title  : 'Our projects',
          content: 'This is my awesome feature!',
        },
        {
          target : '.my-step-2',
          content: 'This another awesome feature!',
        },
        {
          target : '.my-step-3',
          locale : { skip: <strong aria-label="skip">S-K-I-P</strong> },
          content: 'This another awesome feature!',
        },
      ]
    };
  }
}