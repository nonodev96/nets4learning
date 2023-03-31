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
 * @property {"string"} type
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
  //   type        : "string",
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
   * @param {Array<{
   *   column_name: string,
   *   column_type: "int32"|"float32"|"string"|"categorical"|"ignored"
   * }>} list_column_type_to_transform
   * @return {
   *   dataframeProcessed : dfd.DataFrame,
   *   xTrain : dfd.DataFrame,
   *   yTrain : dfd.DataFrame,
   *   attributes: Array<TYPE_ATTRIBUTES_OPTIONS|TYPE_ATTRIBUTES_NUMBER>,
   *   classes   : Array<TYPE_CLASSES>,
   *   data      : any[]
   * }
   */
  static transform(dataframe, list_column_type_to_transform) {
    // Creamos las listas de atributos y de clases objetivos
    const list_attributes = []
    const list_classes = []

    // Copiamos el dataframe
    const dataframe_copy = dataframe.copy()
    // Definimos los rangos
    const list_attributes_to_transform = list_column_type_to_transform.slice(0, -1)
    const column_target_to_transform = list_column_type_to_transform.slice(-1)[0]

    // Eliminamos las columnas que no son necesarias del dataframe
    const list_columns_to_drop = list_attributes_to_transform
      .filter(({ column_name, column_type }) => column_type === "ignored")
      .map(({ column_name }) => column_name)
    // console.debug({ list_columns_to_drop })
    const newDataframe = dataframe_copy.drop({ columns: list_columns_to_drop })

    //  Procesamos
    for (const { column_name, column_type } of list_attributes_to_transform) {
      switch (column_type) {
        case "int32": {
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : column_type,
          })
          break
        }
        case "float32": {
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : column_type,
          })
          break
        }
        case "string": {
          // Codificamos las columnas de tipo string
          const encode = new dfd.LabelEncoder()
          encode.fit(newDataframe[column_name])
          const new_serie = encode.transform(newDataframe[column_name].values)
          newDataframe.addColumn(column_name, new_serie, { inplace: true })
          const list_options = []
          for (const [key, value] of Object.entries(encode.$labels)) {
            list_options.push({
              value: value,
              text : key
            })
          }
          list_attributes.push({
            index_column: newDataframe.columns.indexOf(column_name),
            name        : column_name,
            type        : column_type,
            options     : list_options
          })
          break
        }
      }
    }

    // TARGET
    const {
      column_name: column_target_name,
      column_type: column_target_type
    } = column_target_to_transform
    switch (column_target_type) {
      case "int32": {
        break;
      }
      case "float32": {
        break;
      }
      case "string": {
        const encode_target = new dfd.LabelEncoder()
        encode_target.fit(newDataframe[column_target_name])
        const new_serie_target = encode_target.transform(newDataframe[column_target_name].values)
        newDataframe.addColumn(column_target_name, new_serie_target, { inplace: true })
        for (const [key, value] of Object.entries(encode_target.$labels)) {
          list_classes.push({
            key : value,
            name: key
          })
        }
        break;
      }
    }


    const index_of_last_column = newDataframe.columns.indexOf(column_target_name)
    let xTrain = newDataframe.iloc({ columns: [`:${index_of_last_column}`] })
    let yTrain = newDataframe[column_target_name]

    const scaler = new dfd.MinMaxScaler()
    scaler.fit(xTrain)
    xTrain = scaler.transform(xTrain)

    for (const column of xTrain.columns) {
      newDataframe.addColumn(column, xTrain[column].values, { inplace: true })
    }

    const data = [...newDataframe.values]


    return {
      dataframeProcessed: newDataframe,
      xTrain            : xTrain,
      yTrain            : yTrain,
      attributes        : list_attributes,
      classes           : list_classes,
      data              : data
    }
  }
}