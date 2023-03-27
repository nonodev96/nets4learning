import { Trans } from "react-i18next";
import { MODEL_OBJECT_DETECTION } from "./_model";

export class MODEL_COCO_SSD extends MODEL_OBJECT_DETECTION {
  TITLE = "datasets-models.2-object-detection.coco-ssd.title"
  static KEY = "COCO-SSD"
  static URL = ""
  static URL_MODEL = ""

  DESCRIPTION() {
    const prefix = "datasets-models.2-object-detection.coco-ssd.description."
    return <>
      <p><Trans i18nKey={prefix + "text-0"} /></p>
      <p>
        <Trans i18nKey={prefix + "text-1"}
               components={{
                 link1: <a href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd" target={"_blank"} rel={"noreferrer"}>TEXT</a>
               }} />
      </p>
      <p>
        <Trans i18nKey={prefix + "text-2"}
               components={{
                 link1: <a href="https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts" target={"_blank"} rel={"noreferrer"}>TEXT</a>
               }} />
      </p>
      <p><Trans i18nKey={prefix + "text-3"} /></p>
      <details>
        <summary><Trans i18nKey={prefix + "details-input.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-input.list.0"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-output.title"} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + "details-output.list.0"} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + "details-references.title"} /></summary>
        <ol>
          <li>
            <Trans i18nKey={prefix + "details-references.list.0"}
                   components={{
                     link1: <a href="https://cocodataset.org/" target={"_blank"} rel={"noreferrer"}>TEXT</a>
                   }} />
          </li>
        </ol>
      </details>
    </>
  }
}