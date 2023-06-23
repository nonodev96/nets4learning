import * as df from "danfojs";
import * as tf from "@tensorflow/tfjs"
import * as tfjs from "@tensorflow/tfjs";
import I_MODEL_LINEAR_REGRESSION from "./_model";
import { Trans } from "react-i18next";

export default class MODEL_AUTO_MPG extends I_MODEL_LINEAR_REGRESSION {

  static KEY = "AUTO_MPG"
  static URL = "https://archive.ics.uci.edu/ml/datasets/auto+mpg"
  i18n_TITLE = "datasets-models.1-linear-regression.auto-mpg.title"
  _KEY = "AUTO_MPG"


  async dataframe() {
    return df.readCSV(process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/auto-mpg.csv")
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
          content: <>
            <div className="col-sm-4 col-sm-offset-4 embed-responsive embed-responsive-4by3">
              <audio controls className="embed-responsive-item" controlsList="nofullscreen nodownload noremoteplayback">
                <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
              </audio>
            </div>
          </>,
        },
      ]
    };
  }
}