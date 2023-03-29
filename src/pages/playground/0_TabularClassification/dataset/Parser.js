import * as dfd from "danfojs";

/**
 * @typedef TYPE_ATTRIBUTES_OPTIONS_LIST
 * @type {Object}
 * @property {string} value
 * @property {string} text
 */

/**
 * @typedef TYPE_ATTRIBUTES_OPTIONS
 * @type {Object}
 * @property {"select"} type
 * @property {number} index_column
 * @property {string} name
 * @property {string} name
 * @property {Array<TYPE_ATTRIBUTES_OPTIONS_LIST>} options
 */

/**
 * @typedef TYPE_ATTRIBUTES_NUMBER
 * @type {Object}
 * @property {"int32"|"float32"} type
 * @property {number} index_column
 * @property {string} name
 */

/**
 * @typedef TYPE_CLASSES
 * @type {Object}
 * @property {string} key
 * @property {string} name
 */

/**
 * @typedef CUSTOM_JSON_CSV
 * @type {Object}
 * @property {boolean} missing_values
 * @property {string} missing_value_key
 * @property {Array<TYPE_CLASSES>} classes
 * @property {Array<TYPE_ATTRIBUTES_OPTIONS|TYPE_ATTRIBUTES_NUMBER>} attributes
 * @property {Array} data
 */
  // TYPE_ATTRIBUTES_OPTIONS
  // {
  //   type        : "select",
  //   index_column: 0,
  //   name        : "buying",
  //   options     : [
  //     {
  //       value: "vhigh",
  //       text : "vhigh"
  //     }
  //   ]
  // },

  // TYPE_ATTRIBUTES_NUMBER
  // {
  //   type        : "float32",
  //   index_column: 0,
  //   name        : "Longitud sépalo"
  // },

export class Parser {

  /**
   *
   * @param {dfd.DataFrame} dataframe
   * @param {Array<{column_name: string, column_dtype:"int32"|"float32"|"string"|"categorical"|"ignored"}>}new_ctypes_list
   * @returns {dfd.DataFrame}
   */
  static transfrom(dataframe, new_ctypes_list) {
    const dataframe_copy = dataframe.copy()
    const list_columns_to_drop = new_ctypes_list
      .filter(({ column_name, column_dtype }) => column_dtype === "ignored")
      .map(({ column_name }) => column_name)
    // Eliminamos las columnas que no son necesarias
    let newDataframe = dataframe_copy.drop({ columns: list_columns_to_drop })

    const list_columns_to_encode = new_ctypes_list
      .filter(({ column_name, column_dtype }) => column_dtype === "categorical")
      .map(({ column_name }) => column_name)
    console.log({ list_columns_to_encode })
    for (const column_to_encode of list_columns_to_encode) {
      const encode = new dfd.LabelEncoder()
      encode.fit(newDataframe[column_to_encode])
      const newSerie = encode.transform(newDataframe[column_to_encode].values)
      newDataframe.addColumn( column_to_encode, newSerie, { inplace: true })
    }


    // Entrenamos el escalador
    const scaler = new dfd.MinMaxScaler()
    scaler.fit(newDataframe)

    // Escalamos
    const newDataframe_scaled = scaler.transform(newDataframe)

    return newDataframe_scaled
  }


  /**
   * @returns {CUSTOM_JSON_CSV}
   */
  static getTemplate() {
    return {
      missing_values   : false,
      missing_value_key: "",
      classes          : [],
      attributes       : [],
      data             : []
    }
  }
}