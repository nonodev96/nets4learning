export const TABLE_PLOT_STYLE_HEADER_STYLE = {
  align      : 'center',
  fill       : { color: ['gray'] },
  font       : { family: 'Arial', size: 15, color: 'white' },
  columnwidth: 200,
}
export const TABLE_PLOT_STYLE_CELL_STYLE = {
  align: ['center'],
  line : { color: 'black', width: 1 },
}

export const TABLE_PLOT_STYLE_CONFIG = {
  tableHeaderStyle: TABLE_PLOT_STYLE_HEADER_STYLE,
  tableCellStyle  : TABLE_PLOT_STYLE_CELL_STYLE,
}

export const DANFOJS_FRAME_CONFIG = {
  frameConfig: {
    config: {
      tableMaxColInConsole: 20,
      tableMaxRow         : 40
    }
  }
}