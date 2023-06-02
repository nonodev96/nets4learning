import { Trans } from "react-i18next";

export default function N4LDatasetClasses({ element }) {
  return <>
    <details>
      <summary><Trans i18nKey={"dataset.details.classes"} /></summary>
      <main>
        {element}
      </main>
    </details>
  </>
}