import * as tfjs from "@tensorflow/tfjs";
import * as dfd from "danfojs";
import { Trans } from "react-i18next";
import I_DATASETS_LINEAR_REGRESSION from "./_model";

export default class DATASET_3_BOSTON_HOUSING extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = "BOSTON_HOUSING"
  URL = "https://archive.ics.uci.edu/ml/datasets/Housing"
  i18n_TITLE = "datasets-models.1-linear-regression.boston-housing.title"
  _KEY = "BOSTON_HOUSING"

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
        <summary><Trans i18nKey={prefix + "details-1-input.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-1-input.list.1"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-2-output.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-2-output.list.1"} /></li>
          <li><Trans i18nKey={prefix + "details-2-output.list.2"} /></li>
          <li><Trans i18nKey={prefix + "details-2-output.list.3"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-3-references.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-3-references.list.1"} /></li>
        </ol>
      </details>

    </>
  }

  async DATASETS() {
    const datasets_path = process.env.REACT_APP_PATH + "/datasets/linear-regression/boston-housing/"
    const path_dataset = process.env.REACT_APP_PATH + "/datasets/linear-regression/boston-housing/housing.csv"
    const dataframe_original = await dfd.readCSV(path_dataset)
    const dataframe_processed = await dfd.readCSV(path_dataset)

    return {
      datasets     : [{
        path               : path_dataset,
        csv                : "housing.csv",
        info               : "housing.names",
        dataframe_original : dataframe_original,
        dataframe_processed: dataframe_processed,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      datasets_path: datasets_path
    }
  }

  LAYERS() {
    const inputShape = 7
    const model = tfjs.sequential()
    model.add(tfjs.layers.dense({ units: 64, activation: "relu", inputShape: [inputShape] }))
    model.add(tfjs.layers.dense({ units: 64, activation: "relu" }))
    model.add(tfjs.layers.dense({ units: 64, activation: "relu" }))
    model.add(tfjs.layers.dense({ units: 64, activation: "relu" }))
    model.add(tfjs.layers.dense({ units: 1, activation: "relu" }))
    return model
  }

  COMPILE() {
    const model = tfjs.sequential()
    model.compile({
      optimizer: tfjs.train.rmsprop(0.01),
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