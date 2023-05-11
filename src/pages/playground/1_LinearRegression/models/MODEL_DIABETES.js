// TODO
// No esta en ics.uci.edu
import * as dfd from "danfojs";

/**
 * @implements {I_MODEL_LINEAR_REGRESSION}
 */
export default class MODEL_DIABETES {

  static KEY = "MODEL_DIABETES"
  i18n_TITLE = "datasets-models.1-linear-regression.diabetes.title"
  URL = "https://github.com/jbrownlee/Datasets/blob/master/pima-indians-diabetes.names"

  constructor() {

  }

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