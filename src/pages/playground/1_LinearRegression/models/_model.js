export default class I_MODEL_LINEAR_REGRESSION {
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
   *    callback  : Function,
   *    locale    : Object,
   *    style     : Object,
   *    steps     : Array<{content: string, target: string}>
   * }}
   * @constructor
   */
  JOYRIDE() {
    return {
      debug     : process.env.REACT_APP_ENVIRONMENT === "development",
      locale   : {
        back : this.t("joyride.back"),
        close: this.t("joyride.close"),
        last : this.t("joyride.last"),
        next : this.t("joyride.next"),
        open : this.t("joyride.open"),
        skip : this.t("joyride.skip")
      },
      run       : true,
      continuous: false,
      callback  : (_e) => {
        // console.log("callback", e)
      },
      style     : {},
      steps     : []
    }
  }
}