import * as tf from "@tensorflow/tfjs";

export const MODEL_LYMPHOGRAPHY = {
  KEY              : "LYMPHOGRAPHY",
  TITLE            : "Clasificación por datos de linfomas",
  URL              : "https://archive.ics.uci.edu/ml/datasets/Lymphography",
  URL_DATASET      : "https://archive.ics.uci.edu/ml/machine-learning-databases/lymphography/",
  DESCRIPTION      : <>
    <p>El conjunto de datos de <i>lymphographya</i> permite detectar que posibles fases de un linfoma y en que estado se encuentra.</p>
    <ul>
      <li><a target="_blank" rel="noreferrer" href="https://archive.ics.uci.edu/ml/datasets/Lymphography">Repositorio</a></li>
      <li><a target="_blank" rel="noreferrer" href="https://archive.ics.uci.edu/ml/machine-learning-databases/lymphography/">Conjunto de datos</a></li>
    </ul>
    <details>
      <summary>Datos de entrada</summary>
      <ol>
        <li><b>lymphatics</b>: normal, arched, deformed, displaced</li>
        <li><b>block of affere</b>: no, yes</li>
        <li><b>bl. of lymph. c</b>: no, yes</li>
        <li><b>bl. of lymph. s</b>: no, yes</li>
        <li><b>by pass</b>: no, yes</li>
        <li><b>extravasates</b>: no, yes</li>
        <li><b>regeneration of</b>: no, yes</li>
        <li><b>early uptake in</b>: no, yes</li>
        <li><b>lym.nodes dimin</b>: 0-3</li>
        <li><b>lym.nodes enlar</b>: 1-4</li>
        <li><b>changes in lym.</b>: bean, oval, round</li>
        <li><b>defect in node</b>: no, lacunar, lac. marginal, lac. central</li>
        <li><b>changes in node</b>: no, lacunar, lac. margin, lac. central</li>
        <li><b>changes in stru</b>: no, grainy, drop-like, coarse, diluted, reticular, stripped, faint,</li>
        <li><b>special forms</b>: no, chalices, vesicles</li>
        <li><b>dislocation of</b>: no, yes</li>
        <li><b>exclusion of no</b>: no, yes</li>
        <li><b>no. of nodes in</b>: 0-9, 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, >=70</li>
      </ol>
    </details>
    <details>
      <summary>Datos de salida</summary>
      <ol>
        <li><b>normal find</b>: normal</li>
        <li><b>metastases</b>: metastasis</li>
        <li><b>malign lymph</b>: linfoma maligno</li>
        <li><b>fibrosis</b>: fibrosis</li>
      </ol>
    </details>
  </>,
  HTML_EXAMPLE     : <>
    <p>
      Introduce separado por punto y coma los siguientes valores correspondientes a la planta que se va a evaluar:
      <br/>
      <b>(lymphatics, block of affere, bl. of lymph. c, bl. of lymph. s, by pass, extravasates,
        regeneration of, early uptake in, lym.nodes dimin, lym.nodes enlar, changes in lym.,
        defect in node, changes in node, changes in stru, special forms, dislocation of,
        exclusion of no, no. of nodes in).</b>
    </p>
    <p>Ejemplos:</p>
  </>,
  loadModel        : async () => {
    return await tf.loadLayersModel(process.env.REACT_APP_PATH + "/models/classification/lymphography/lymphography-model.json")
  },
  function_v_input : async (element, index, param = "") => {
    return "TODO"
  },
  CONFIGURATION    : <></>,
  EXAMPLES         : [],
  CLASSES          : ["normal find", "metastases", "malign lymph", "fibrosis"],
  NUM_CLASSES      : 4,
  DATA_OBJECT      : {},
  DATA_DEFAULT     : {},
  DATA_OBJECT_KEYS : [
    "lymphatics",
    "block of affere",
    "bl. of lymph. c",
    "bl. of lymph. s",
    "by pass",
    "extravasates",
    "regeneration",
    "early uptake in",
    "lym.nodes dimin",
    "lym.nodes enlar",
    "changes in lym",
    "defect in node",
    "changes in node",
    "changes in stru",
    "special forms",
    "dislocation of",
    "exclusion of",
    "no. of nodes in"
  ],
  DATA_CLASSES_KEYS: [],
  LIST_EXAMPLES    : [],
  // @formatter:off
  FORM             : [
    { type: "select", name: "lymphatics",       options: [{ value: "1", text: "normal" }, { value: "2", text: "arched" },    { value: "3", text: "deformed" },     { value: "4", text: "displaced" }]},
    { type: "select", name: "block of affere",  options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "bl. of lymph. c",  options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "bl. of lymph. s",  options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "by pass",          options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "extravasates",     options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "regeneration",     options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "early uptake in",  options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "lym.nodes dimin",  options: [{ value: "1", text: "1" },      { value: "2", text: "2" },         { value: "3", text: "3" }]},
    { type: "select", name: "lym.nodes enlar",  options: [{ value: "1", text: "1" },      { value: "2", text: "2" },         { value: "3", text: "3" },              { value: "4", text: "4" }]},
    { type: "select", name: "changes in lym",   options: [{ value: "1", text: "bean" },   { value: "2", text: "oval" },      { value: "3", text: "round" }]},
    { type: "select", name: "defect in node",   options: [{ value: "1", text: "No" },     { value: "2", text: "lacunar" },   { value: "3", text: "lac. marginal" },  { value: "4", text: "lac. central" }]},
    { type: "select", name: "changes in node",  options: [{ value: "1", text: "No" },     { value: "2", text: "lacunar" },   { value: "3", text: "lac. marginal" },  { value: "4", text: "lac. central" }]},
    { type: "select", name: "changes in stru",  options: [{ value: "1", text: "No" },     { value: "2", text: "grainy" },    { value: "3", text: "drop-like" },      { value: "4", text: "coarse" }, { value: "5", text: "diluted" }, { value: "6", text: "reticular" }, { value: "7", text: "stripped" }, { value: "8", text: "faint" }]},
    { type: "select", name: "special forms",    options: [{ value: "1", text: "No" },     { value: "2", text: "chalices" },  { value: "3", text: "vesicles" }]},
    { type: "select", name: "dislocation of",   options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "exclusion of",     options: [{ value: "1", text: "No" },     { value: "2", text: "Sí" }]},
    { type: "select", name: "no. of nodes in",  options: [{ value: "1", text: "0-9" },    { value: "2", text: "10-19" },     { value: "3", text: "20-29" },          { value: "4", text: "30-39" },  { value: "5", text: "40-49" },  { value: "6", text: "50-59" },      { value: "7", text: "60-69" },    { value: "8", text: "=>70" }]}
  ],
  TABLE_HEADER: [
    "lymphatics",
    "block of affere",
    "bl. of lymph. c",
    "bl. of lymph. s",
    "by pass",
    "extravasates",
    "regeneration",
    "early uptake in",
    "lym.nodes dimin",
    "lym.nodes enlar",
    "changes in lym",
    "defect in node",
    "changes in node",
    "changes in stru",
    "special forms",
    "dislocation of",
    "exclusion of",
    "no. of nodes in",
    "Category"
  ],
  DATA        : [
    [4,2,1,1,1,1,1,2,1,2,2,2,4,8,1,1,2,2,3],
    [3,2,1,1,2,2,1,2,1,3,3,2,3,4,2,2,2,2,2],
    [3,2,2,2,2,2,2,2,1,4,3,3,4,8,3,2,2,7,3],
    [3,1,1,1,1,2,1,2,1,3,3,4,4,4,3,1,2,6,3],
    [3,1,1,1,1,1,1,1,1,2,2,4,3,5,1,2,2,1,2],
    [2,1,1,1,1,1,1,2,1,3,3,3,3,6,3,1,2,4,2],
    [2,2,1,1,1,1,1,2,1,2,3,2,3,8,2,1,1,1,2],
    [3,2,1,1,1,2,1,2,1,2,2,2,2,1,3,1,1,1,2],
    [2,2,1,1,1,1,1,2,1,3,2,2,2,8,3,1,2,5,3],
    [2,1,1,1,1,1,1,2,1,2,2,3,3,5,3,1,1,2,3],
    [2,2,2,1,2,2,1,2,1,3,2,4,3,5,1,2,2,3,2],
    [4,2,1,1,1,2,1,1,1,3,3,4,3,8,3,2,2,2,2],
    [4,2,1,1,1,1,1,2,1,2,2,2,2,3,2,1,1,1,2],
    [4,1,1,1,1,2,1,2,1,4,2,2,4,7,3,2,2,2,3],
    [3,2,2,2,2,2,2,2,3,1,1,2,2,8,1,2,2,4,4],
    [2,2,1,1,1,2,1,2,1,2,3,3,3,5,3,2,2,2,2],
    [3,2,1,1,1,2,1,2,1,2,3,3,3,2,2,2,2,3,2],
    [2,2,1,1,1,2,1,1,1,2,2,2,3,5,2,1,2,2,2],
    [3,1,1,1,1,1,1,2,1,2,2,2,3,2,1,2,2,1,2],
    [2,2,1,1,1,1,1,2,1,3,3,3,3,2,2,2,1,1,2],
    [3,1,1,1,1,1,1,2,1,2,2,4,2,4,3,2,2,3,3],
    [4,1,1,1,2,2,1,2,1,3,3,3,4,5,3,2,2,4,3],
    [4,2,1,1,2,2,1,2,1,4,3,4,3,4,2,2,2,2,2],
    [3,2,1,1,1,1,1,2,1,2,2,2,2,5,1,1,1,1,2],
    [3,1,1,1,1,1,1,2,2,1,2,2,2,8,3,1,2,8,3],
    [3,1,1,1,1,2,1,1,1,3,2,3,3,8,3,2,2,2,3],
    [4,1,1,1,1,2,1,2,1,3,3,4,2,4,3,2,2,4,3],
    [4,1,1,1,1,1,1,2,1,3,2,4,4,8,3,2,2,1,3],
    [4,2,1,1,1,1,1,2,1,2,2,2,3,3,2,2,2,1,2],
    [3,1,1,1,1,1,1,1,1,2,2,4,2,8,2,2,2,1,3],
    [4,2,1,1,1,2,1,2,1,4,3,3,3,7,3,2,2,3,3],
    [2,1,1,1,1,1,1,2,1,3,2,3,3,8,3,2,2,3,3],
    [2,1,1,1,1,1,1,1,1,2,3,2,2,8,1,2,1,1,2],
    [2,2,1,1,1,1,1,1,1,1,2,2,3,3,1,1,1,1,2],
    [4,2,1,1,2,2,1,2,1,3,3,4,3,4,3,2,2,2,2],
    [2,2,2,1,2,2,1,2,1,3,3,3,3,8,3,1,2,2,2],
    [3,1,1,1,2,2,2,1,3,1,1,4,2,5,3,1,2,4,4],
    [3,1,1,1,1,2,1,2,1,4,3,4,2,4,3,2,2,6,3],
    [2,1,1,1,1,1,1,2,1,3,3,2,3,4,3,2,2,2,3],
    [2,1,1,1,1,1,1,2,1,2,2,2,1,7,1,2,2,2,3],
    [2,1,1,1,1,2,1,2,1,2,2,3,3,3,3,1,2,1,3],
    [2,2,2,1,2,2,2,2,1,4,2,2,2,4,3,2,2,6,3],
    [3,2,2,1,1,2,1,1,1,3,2,3,3,4,3,1,2,2,2],
    [4,2,1,1,2,1,1,2,1,3,3,3,3,2,2,2,2,3,2],
    [3,2,2,2,2,2,2,1,2,2,2,4,2,4,3,2,2,7,4],
    [2,1,1,1,1,1,1,2,1,2,2,2,2,8,2,2,2,1,3],
    [3,2,2,1,2,1,1,2,1,2,2,3,3,8,3,1,2,1,2],
    [4,1,1,1,1,1,1,1,2,1,3,4,2,8,1,2,2,1,2],
    [3,2,2,1,1,2,1,1,1,2,3,3,3,5,2,1,2,2,2],
    [2,2,2,1,1,1,1,2,1,2,2,4,3,8,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,1,1,2,2,3,1,2,2,1,2],
    [3,2,1,1,1,2,1,2,1,2,2,2,4,8,3,1,2,3,3],
    [3,1,1,1,1,1,2,1,1,2,2,4,3,5,2,1,2,1,2],
    [2,2,1,1,2,2,1,1,1,3,3,4,3,4,3,1,1,1,2],
    [2,2,2,1,2,2,1,1,1,2,2,3,3,4,2,1,2,1,2],
    [4,1,1,1,1,1,1,2,1,2,2,3,3,3,3,2,1,1,3],
    [2,1,1,1,1,1,1,2,1,3,2,4,2,8,3,2,2,4,3],
    [4,2,1,1,2,2,1,2,1,2,3,2,3,2,3,2,2,4,2],
    [4,2,2,2,2,2,2,2,1,4,3,4,4,7,3,2,2,8,3],
    [2,2,2,1,2,2,1,2,1,3,3,3,3,8,3,2,2,2,2],
    [4,1,1,1,1,1,1,2,1,4,2,2,4,7,3,2,2,7,3],
    [3,2,2,1,2,2,1,2,1,3,2,2,3,4,1,2,2,1,2],
    [3,1,1,1,1,2,1,2,1,4,2,4,4,2,3,2,2,3,3],
    [4,2,1,1,1,2,1,1,1,2,3,2,3,2,2,1,1,1,2],
    [2,2,1,1,1,1,1,1,1,2,2,3,3,5,2,2,2,1,2],
    [4,1,1,1,2,1,2,2,1,3,2,3,4,5,3,2,2,7,3],
    [2,1,1,1,1,1,1,2,1,4,3,4,4,5,3,2,2,5,3],
    [3,2,2,1,2,2,1,1,1,3,3,4,3,4,2,2,2,3,2],
    [2,1,1,1,1,1,1,1,1,2,3,2,3,3,2,2,1,1,3],
    [2,1,1,1,1,1,1,2,1,3,2,2,2,6,3,2,2,6,3],
    [3,2,1,1,1,2,1,2,1,3,3,3,3,4,3,2,2,1,2],
    [3,1,1,1,1,1,1,1,1,2,2,2,2,5,1,1,2,2,3],
    [4,2,1,1,2,2,1,1,1,1,3,3,3,3,3,2,2,3,2],
    [3,1,1,1,1,1,1,2,1,4,3,3,4,5,3,2,2,3,3],
    [2,1,1,1,1,2,1,1,1,2,2,2,2,3,1,1,1,1,3],
    [4,2,2,1,2,2,1,2,1,3,3,4,3,8,2,2,2,3,2],
    [4,2,2,1,1,1,1,2,1,2,2,2,3,3,2,2,2,2,2],
    [3,1,1,1,2,1,1,2,1,2,3,3,3,5,3,1,1,1,2],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [3,2,1,1,1,1,1,2,1,3,2,2,4,8,3,2,2,3,3],
    [2,2,1,1,1,2,1,2,1,3,3,3,4,8,3,2,2,2,3],
    [4,2,1,1,1,1,1,1,1,4,3,3,3,4,2,2,1,1,2],
    [2,1,1,1,1,1,1,2,1,3,2,2,2,8,3,2,2,5,3],
    [2,2,2,1,2,2,2,2,1,3,3,4,4,5,3,2,2,5,3],
    [4,1,1,1,1,2,1,2,1,4,3,4,2,5,3,2,2,2,3],
    [2,2,1,1,2,2,1,1,1,2,2,4,2,8,3,2,2,1,2],
    [2,2,1,1,1,1,1,2,1,2,3,3,3,5,2,1,2,1,2],
    [2,2,1,1,1,1,1,2,1,2,2,2,3,8,3,1,2,1,2],
    [2,2,1,1,1,2,1,2,1,3,3,4,2,8,3,2,2,2,3],
    [3,1,1,1,1,1,1,2,1,3,2,2,2,8,1,1,1,1,2],
    [4,2,2,1,2,2,1,2,1,1,2,2,1,3,1,2,2,2,3],
    [2,2,2,1,1,2,1,1,1,2,3,2,3,3,2,1,1,1,2],
    [3,2,2,1,2,2,1,2,1,2,3,3,4,2,2,2,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,2,2,3,3,1,2,2,1,2],
    [2,1,1,1,1,1,1,2,1,3,2,4,4,4,3,2,2,5,3],
    [2,1,1,1,1,1,1,2,1,2,2,4,2,8,3,2,2,3,3],
    [3,2,1,1,1,1,1,1,1,2,2,3,3,3,3,1,1,2,2],
    [2,2,1,1,1,2,1,2,1,2,3,2,2,4,2,1,1,2,2],
    [3,2,1,1,1,1,1,1,1,2,2,3,3,5,1,1,1,1,2],
    [3,2,1,1,1,2,1,1,1,2,2,4,3,4,1,2,2,2,2],
    [2,1,1,1,1,2,1,2,1,3,3,4,2,8,3,2,2,3,3],
    [2,2,1,1,1,1,1,2,1,2,2,3,3,2,3,2,2,2,2],
    [2,1,1,1,1,1,1,2,1,2,2,2,2,4,1,2,1,2,2],
    [3,2,1,1,2,2,1,1,1,2,2,4,3,2,1,2,2,3,2],
    [4,1,1,1,1,1,1,2,1,3,3,2,2,4,2,2,2,2,2],
    [2,2,1,1,1,1,1,2,1,4,3,4,2,7,3,2,2,5,3],
    [3,2,1,1,1,1,1,2,1,2,3,3,3,8,2,2,2,1,2],
    [2,2,1,1,1,2,1,2,1,4,3,4,4,8,3,2,2,7,3],
    [3,2,1,1,1,2,1,1,1,2,3,4,2,4,1,1,1,1,2],
    [2,2,1,1,1,1,1,2,1,2,3,3,3,5,3,1,2,1,2],
    [2,1,1,1,1,1,1,1,1,2,3,3,3,8,3,1,1,1,2],
    [4,1,1,1,1,2,1,2,1,4,3,4,3,3,3,2,2,5,3],
    [2,1,1,1,1,1,1,1,1,2,2,2,2,8,1,1,1,1,2],
    [2,1,1,1,1,2,1,2,1,2,2,2,2,8,2,1,2,2,3],
    [3,1,1,1,1,1,1,2,1,2,2,4,4,2,3,2,1,1,3],
    [3,1,1,1,1,2,1,2,1,2,2,4,3,8,2,2,2,1,3],
    [4,1,1,1,1,1,1,2,1,3,2,2,4,3,2,2,1,1,3],
    [4,2,2,1,1,2,1,2,1,2,2,3,3,8,3,2,2,2,2],
    [2,1,1,1,1,2,1,2,1,3,2,2,2,4,3,1,2,5,3],
    [4,2,1,1,2,2,1,2,1,3,3,4,2,5,3,2,2,3,3],
    [2,1,1,1,1,1,1,1,1,1,2,4,3,8,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,2,2,2,3,8,2,1,2,1,2],
    [2,2,2,2,2,2,1,1,1,2,2,4,3,8,2,2,2,3,2],
    [3,1,1,1,1,1,1,1,1,2,3,3,3,4,3,1,2,2,2],
    [4,2,1,1,1,2,1,1,1,2,2,3,3,5,2,1,2,1,2],
    [3,1,1,1,1,2,1,2,1,4,2,2,2,4,3,2,2,7,3],
    [2,2,1,1,1,1,1,2,1,3,3,3,3,3,2,1,2,1,2],
    [2,2,1,1,1,2,1,2,1,2,2,3,3,4,2,1,2,1,2],
    [2,1,1,1,1,2,1,2,1,2,2,2,4,8,1,2,2,2,3],
    [3,2,1,1,1,2,1,2,1,3,2,4,3,4,2,2,2,2,2],
    [2,2,1,1,1,1,1,2,1,4,3,4,2,8,2,1,2,4,2],
    [4,2,2,2,2,2,1,2,1,4,3,4,4,7,3,2,2,6,3],
    [4,1,1,1,1,1,1,2,1,4,2,4,2,8,3,2,2,6,3],
    [3,2,1,1,1,1,1,2,1,2,3,3,3,5,2,2,1,1,2],
    [2,2,1,1,1,2,1,2,1,2,2,4,4,5,3,2,2,1,2],
    [3,2,2,2,2,2,1,2,1,2,3,3,3,4,3,2,2,7,2],
    [1,1,1,1,1,2,1,2,1,2,2,1,1,2,1,1,1,2,1],
    [2,1,1,1,1,2,1,2,1,3,3,2,2,4,3,2,2,6,3],
    [2,2,1,1,1,1,1,1,1,2,3,3,3,3,3,1,2,1,2],
    [3,1,1,1,2,2,2,1,3,1,1,2,1,5,3,1,1,7,4],
    [2,2,1,1,1,1,1,1,1,2,3,3,3,2,2,2,2,1,2],
    [2,1,1,1,1,1,1,2,1,2,2,4,4,8,2,1,2,2,3],
    [2,2,1,1,1,2,1,2,1,2,3,3,3,5,3,2,2,1,2],
    [3,2,1,1,2,2,1,2,1,2,2,4,3,5,2,2,2,4,3],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,3,1,2,2,1,2],
    [2,2,1,1,1,2,1,2,1,3,3,3,3,8,3,2,2,4,3],
    [2,1,1,1,1,1,1,2,1,2,2,4,2,2,1,2,2,1,2],
    [2,2,2,1,2,2,1,2,1,3,3,4,3,4,3,2,2,6,2]
  ]

  // @formatter:on
}
