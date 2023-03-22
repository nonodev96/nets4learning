/**
 * @type {TYPE_MODEL_OBJECT_DETECTION}
 */
export const MODEL_FACE_DETECTOR = {
  KEY         : "FACE-DETECTOR",
  TITLE       : "",
  URL         : "",
  URL_MODEL   : "",
  DESCRIPTION: <>
    <p>
      Este modelo a partir de una imagen o vídeo de entrada, es capaz de reconocer diferentes puntos de la cara para finalmente hacer una malla de la misma.
    </p>
    <details>
      <summary>Datos de entrada</summary>
      <ol>
        <li>Imagen o vídeo de entrada.</li>
      </ol>
    </details>
    <details>
      <summary>Datos de salida</summary>
      <ol>
        <li>Mismo elemento de entrada con una serie de puntos que delimitan la malla de la cara.</li>
      </ol>
    </details>
    <details>
      <summary>Referencias</summary>
      <ol>
        <li>
          <a href="https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1" target="_blank" rel="noreferrer">Entrada del modelo en el repositorio de tensorflow</a>
        </li>
      </ol>
    </details>
  </>,
  HTML_EXAMPLE: <></>
}