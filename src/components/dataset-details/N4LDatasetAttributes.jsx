import { Trans } from "react-i18next";

export default function N4LDatasetAttributes({ element }) {
  return <>
    <details>
      <summary><Trans i18nKey={"dataset.details.attributes"} /></summary>
      <main>
        {element}
      </main>
    </details>
  </>
}