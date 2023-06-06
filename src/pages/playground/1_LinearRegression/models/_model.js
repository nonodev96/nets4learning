export default class I_MODEL_LINEAR_REGRESSION {
  _KEY = ""
  URL_DATASET = ""
  i18n_TITLE = ""


  constructor(_t) {
    this.t = _t
  }

  DESCRIPTION() {
    return <></>
  }

  ATTRIBUTE_INFORMATION() {
    return <></>
  }

  LAYERS() {

  }

  COMPILE() {

  }

  /**
   *
   * callback: (e) => {
   *   e.action    : "start" | "update",
   *   e.controlled: boolean,
   *   e.index     : number,
   *   e.lifecycle : "init" | "ready" | "beacon" | "tooltip" | "complete",
   *   e.size      : 3,
   *   e.status    : "running",
   *   e.type      :"tour:start"
   * }
   *
   * @return {{
   *    run       : boolean,
   *    continuous: boolean,
   *    steps     : Array<{content: string, target: string}>
   * }}
   * @constructor
   */
  JOYRIDE() {
    return {
      debug     : process.env.REACT_APP_ENVIRONMENT === "development",
      run       : true,
      continuous: false,
      steps     : []
    }
  }
}