export default class I_MODEL_OBJECT_DETECTION {
  TITLE = ''
  i18n_TITLE = ''

  _modelDetector = null

  constructor(_t) {
    this.t = _t
  }

  DESCRIPTION() {
    return <></>
  }

  async ENABLE_MODEL() {

  }

  async PREDICTION(_img_or_video) {
    return []
  }

  RENDER(_ctx, _predictions) {

  }

  _drawRect(ctx, x, y, w, h) {
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(0,255,21,0.84)'
    ctx.strokeRect(x, y, w, h)
  }

  _drawTextBG(ctx, txt, font, x, y, padding) {
    ctx.font = font
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#fff'

    let width = ctx.measureText(txt).width
    ctx.fillRect(x, y, width + padding, parseInt(font, 10) + padding)

    ctx.lineWidth = 2
    ctx.strokeStyle = '#009ddf'
    ctx.strokeRect(x, y, width + padding, parseInt(font, 10) + padding)

    ctx.fillStyle = '#009ddf'
    ctx.fillText(txt, x + padding / 2, y + padding / 2)
  }

}
