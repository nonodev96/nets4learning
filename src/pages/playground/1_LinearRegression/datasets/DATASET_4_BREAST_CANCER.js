import I_DATASETS_LINEAR_REGRESSION from "./_model";
import * as dfd from "danfojs";
import { DataFrameTransform } from "../DataFrameTransform";
import { DANFOJS_FRAME_CONFIG } from "../../../../ConfigDanfoJS";

export default class DATASET_4_BREAST_CANCER extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = "BREAST_CANCER"
  URL = "https://archive-beta.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic"
  i18n_TITLE = "datasets-models.1-linear-regression.breast-cancer.title"
  _KEY = "BREAST_CANCER"

  async DATASETS() {
    const datasets_path = process.env.REACT_APP_PATH + "/datasets/linear-regression/breast-cancer/"
    const path_dataset_1 = datasets_path + "breast-cancer-wisconsin.csv"
    const path_dataset_2 = datasets_path + "wdbc.csv"
    const path_dataset_3 = datasets_path + "wpbc.csv"

    const dataframe_original_1 = await dfd.readCSV(path_dataset_1, DANFOJS_FRAME_CONFIG)
    // TODO FIX
    dataframe_original_1.replace("?", NaN, { columns: ["Bare Nuclei"], inplace: true })
    dataframe_original_1.dropNa({ axis: 1, inplace: true })
    dataframe_original_1.print()

    let dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    const dataset_transforms_1 = [
      { column_name: "Bare Nuclei", column_transform: "dropNa" },
      { column_name: "Bare Nuclei", column_transform: "replace_?_NaN" },
      { column_name: "Bare Nuclei", column_transform: "fill_NaN_median" }
    ]
    dataframe_processed_1 = DataFrameTransform(dataframe_processed_1, dataset_transforms_1)

    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)

    const dataframe_original_3 = await dfd.readCSV(path_dataset_3)
    const dataframe_processed_3 = await dfd.readCSV(path_dataset_3)

    return {
      datasets     : [{
        path               : path_dataset_1,
        info               : "breast-cancer-wisconsin.names",
        csv                : "breast-cancer-wisconsin.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : dataset_transforms_1,
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_2,
        info               : "wdbc.names",
        csv                : "wdbc.csv",
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_3,
        info               : "wpbc.names",
        csv                : "wpbc.csv",
        dataframe_original : dataframe_original_3,
        dataframe_processed: dataframe_processed_3,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      datasets_path: datasets_path
    }
  }

  DESCRIPTION() {
    return <>

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