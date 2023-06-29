import * as dfd from "danfojs";
import I_DATASETS_LINEAR_REGRESSION from "./_model";

export default class DATASET_5_STUDENT_PERFORMANCE extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = "STUDENT_PERFORMANCE";
  _KEY = "STUDENT_PERFORMANCE";
  i18n_TITLE = "datasets-models.1-linear-regression.student-performance.title"
  URL = "https://archive.ics.uci.edu/dataset/320/student+performance"

  async DATASETS() {
    const datasets_path = process.env.REACT_APP_PATH + "/datasets/linear-regression/student-performance/"
    const path_dataset_1 = datasets_path + "student-mat.csv"
    const path_dataset_2 = datasets_path + "student-por.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)
    return {
      datasets     : [{
        path               : path_dataset_1,
        info               : "student.txt",
        csv                : "student-mat.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_2,
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
        csv                : "student-por.csv",
        info               : "student.txt"
      }],
      datasets_path: datasets_path,
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
    return super.JOYRIDE();
  }
}