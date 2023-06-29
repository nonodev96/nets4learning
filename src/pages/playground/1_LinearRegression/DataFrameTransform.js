import * as dfd from "danfojs"

/***
 *
 * @param {dfd.DataFrame} dataframe
 * @param {Array<{column_name, column_transform}>} dataframe_transforms
 *
 * @return {dfd.DataFrame}
 */
export function DataFrameTransform(dataframe, dataframe_transforms) {
  for (const { column_transform, column_name } of dataframe_transforms) {
    switch (column_transform) {
      case "replace_?_NaN": {
        dataframe.replace("?", NaN, { columns: [column_name], inplace: true })
        break
      }
      case "fill_NaN_median": {
        const values = dataframe[column_name].mean()
        dataframe.fillNa(values, { columns: [column_name], inplace: true })
        break
      }
      case "dropNa": {
        dataframe.dropNa({ columns: [column_name], inplace: true })
        break
      }
      case "drop": {
        dataframe.drop({ columns: [column_name], inplace: true })
        break
      }
      default: {
        console.error("Error, option not valid", column_transform)
      }
    }
  }
  return dataframe
}