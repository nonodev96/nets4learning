import * as df from "danfojs";
import * as tf from "@tensorflow/tfjs"
import * as tfjs from "@tensorflow/tfjs";
import { Trans } from "react-i18next";
import * as dfd from "danfojs";

import I_DATASETS_LINEAR_REGRESSION from "./_model";
import { DataFrameTransform } from "../DataFrameTransform";

export default class DATASET_1_SALARY extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = "SALARY"
  static URL = "https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook"
  i18n_TITLE = "datasets-models.1-linear-regression.salary.title"
  _KEY = "SALARY"

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

  async DATASETS() {
    const datasets_path = process.env.REACT_APP_PATH + "/datasets/linear-regression/salary/"
    const path_dataset_1 = datasets_path + "salary.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_transforms = []
    const dataframe_processed_1 = DataFrameTransform(await dfd.readCSV(path_dataset_1), dataframe_transforms)

    // dataframe_processed_1.print()

    return {
      datasets     : [{
        path                : path_dataset_1,
        info                : "salary.names",
        csv                 : "salary.csv",
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataframe_transforms: dataframe_transforms,
        isDatasetProcessed  : true,
      }],
      datasets_path: datasets_path,
    }
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

  ATTRIBUTE_INFORMATION() {
    return <>

    </>
  }

  JOYRIDE() {
    return super.JOYRIDE()
  }
}