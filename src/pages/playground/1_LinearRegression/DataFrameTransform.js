/***
 *
 * @param {DataFrame} dataframe
 * @param {Array<{column_name, column_transform}>} transforms
 * @return {DataFrame}
 */
export function DataFrameTransform(dataframe, transforms) {

  for (const { column_transform, column_name } in transforms) {
    switch (column_transform) {
      case "replace_?_NAN": {
        dataframe = dataframe.replace("?", NaN, { columns: [column_name] })
        break
      }
      case "fill_NAN_MEDIAN": {
        const values = dataframe[column_name].mean()
        dataframe = dataframe.fillNa(values, { columns: [column_name] })
        break
      }
      default: {
        console.error("Error, option not valid")
      }
    }
  }

  return dataframe
}