import I_MODEL_LINEAR_REGRESSION from "./_model";

export default class MODEL_BREAST_CANCER extends I_MODEL_LINEAR_REGRESSION {

  static KEY = "BREAST_CANCER"
  URL = "https://archive-beta.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic"
  i18n_TITLE = "datasets-models.1-linear-regression.breast-cancer.title"
  _KEY = "BREAST_CANCER"

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