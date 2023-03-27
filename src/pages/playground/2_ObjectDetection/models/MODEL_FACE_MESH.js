import { MODEL_OBJECT_DETECTION } from "./_model";
import { Trans } from "react-i18next";

export class MODEL_FACE_MESH extends MODEL_OBJECT_DETECTION {
  TITLE = "datasets-models.2-object-detection.face-mesh.title"
  static KEY = "FACE-MESH"

  DESCRIPTION() {
    const prefix = "datasets-models.2-object-detection.face-mesh.description."
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
                     link1: <a href={"https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1"} target={"_blank"} rel="noreferrer">link</a>,
                   }} />
          </li>
        </ol>
      </details>
    </>
  }

}
