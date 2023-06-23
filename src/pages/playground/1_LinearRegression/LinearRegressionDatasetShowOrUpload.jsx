import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop"
import React from "react"
import { useTranslation } from "react-i18next"
import LinearRegressionDatasetForm from "./LinearRegressionDatasetForm"

export default function LinearRegressionDatasetShowOrUpload({ dataset, i_model, tmpModel, setTmpModel }) {

  const { t } = useTranslation()

  const handleChange_FileUpload_CSV = () => {

  }

  const handleChange_FileUpload_CSV_reject = () => {

  }

  return <>
    {{
      "0": <>
        <DragAndDrop name={"csv"}
                     accept={{ "text/csv": [".csv"] }}
                     text={t("drag-and-drop.csv")}
                     labelFiles={t("drag-and-drop.label-files-one")}
                     function_DropAccepted={handleChange_FileUpload_CSV}
                     function_DropRejected={handleChange_FileUpload_CSV_reject} />

        {tmpModel.dataframeOriginal && <>
          <LinearRegressionDatasetForm />
        </>}
        {!tmpModel.dataframeOriginal && <>
          <p className="placeholder-glow">
            <small className={"text-muted"}>{t("pages.playground.generator.waiting-for-file")}</small>
            <span className="placeholder col-12"></span>
          </p>
        </>}
      </>,
    }[dataset]}
    {dataset !== "0" ? (
      i_model.DESCRIPTION()
    ) : ("")}
  </>
}