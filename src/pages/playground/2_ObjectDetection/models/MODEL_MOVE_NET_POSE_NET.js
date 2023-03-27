import { MODEL_OBJECT_DETECTION } from "./_model";
import { Trans } from "react-i18next";

export class MODEL_MOVE_NET_POSE_NET extends MODEL_OBJECT_DETECTION {
  TITLE = "datasets-models.2-object-detection.move-net--pose-net.title"
  static KEY = "MOVE-NET--POSE-NET"

  DESCRIPTION() {
    const prefix = "datasets-models.2-object-detection.move-net--pose-net.description."
    return <>
      <p><Trans i18nKey={prefix + "text-0"} /></p>
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
                     link1: <a href={"https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1"} target={"_blank"} rel="noreferrer">link</a>,
                   }} />
          </li>
        </ol>
      </details>
    </>
  }
}