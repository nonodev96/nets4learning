import * as df from "danfojs";
import * as tf from "@tensorflow/tfjs"
import * as tfjs from "@tensorflow/tfjs";
import I_MODEL_LINEAR_REGRESSION from "./_model";
import { Trans } from "react-i18next";

export default class MODEL_SALARY extends I_MODEL_LINEAR_REGRESSION {

  static KEY = "SALARY"
  static URL = "https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook"
  i18n_TITLE = "datasets-models.1-linear-regression.salary.title"
  _KEY = "SALARY"


  async dataframe() {
    return df.readCSV(process.env.REACT_APP_PATH + "/datasets/linear-regression/salary/salary.csv")
  }


  compile() {

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
    const prefix = "datasets-models.1-linear-regression.salary.description."
    return <>
      <p><Trans i18nKey={prefix + "text-1"} /></p>
      <p><Trans i18nKey={prefix + "text-2"} /></p>
      <p>
        <Trans i18nKey={prefix + "text-link"}
               components={{
                 link1: <a href={this.URL} target={"_blank"} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + "details-1.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-1.list.1"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.2"} /></li>
          <li><Trans i18nKey={prefix + "details-1.list.3"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-2.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-2.list.1"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.2"} /></li>
          <li><Trans i18nKey={prefix + "details-2.list.3"} /></li>
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
    return super.JOYRIDE()
  }
}