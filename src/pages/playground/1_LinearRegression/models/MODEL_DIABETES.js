// TODO
// No esta en ics.uci.edu
import * as dfd from "danfojs";
import I_MODEL_LINEAR_REGRESSION from "./_model";

export default class MODEL_DIABETES extends I_MODEL_LINEAR_REGRESSION{

  static KEY = "DIABETES"
  i18n_TITLE = "datasets-models.1-linear-regression.diabetes.title"
  URL = "https://github.com/jbrownlee/Datasets/blob/master/pima-indians-diabetes.names"

  DESCRIPTION() {
    return <>

    </>
  }

  ATTRIBUTE_INFORMATION() {
    return <>

    </>
  }

  async dataframe() {
    return await dfd.readCSV(
      process.env.REACT_APP_PATH +
      "/datasets/linear-regression/diabetes/diabetes.csv"
    )
  }
}