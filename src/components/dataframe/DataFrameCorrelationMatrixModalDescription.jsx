import 'katex/dist/katex.min.css'
import { Modal } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import Latex from 'react-latex-next'

export default function DataFrameCorrelationMatrixModalDescription ({ showDescription, setShowDescription }) {

  return <>
    <Modal show={showDescription} onHide={() => setShowDescription(false)} size={'xl'} fullscreen={'md-down'}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={`dataframe.correlation-matrix.title`} /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>El coeficiente de correlación de Pearson, también conocido como correlación lineal o coeficiente de correlación producto-momento, es una medida estadística utilizada para cuantificar la relación lineal entre dos variables
          cuantitativas. Es uno de los estadísticos de correlación más comúnmente utilizados y proporciona información sobre la fuerza y la dirección de la relación entre las variables.</p>
        <p>El coeficiente de correlación de Pearson varía entre -1 y 1:</p>
        <p>Un valor de -1 indica una correlación lineal perfectamente negativa, lo que significa que a medida que aumenta una variable, la otra disminuye en una relación lineal inversa.</p>
        <p>Un valor de 1 indica una correlación lineal perfectamente positiva, lo que significa que a medida que aumenta una variable, la otra también aumenta en una relación lineal directa.</p>
        <p>Un valor de 0 indica que no hay una correlación lineal entre las variables, lo que implica que no hay una relación lineal entre ellas.</p>
        <p>El cálculo del coeficiente de correlación de Pearson se basa en las covarianzas y las desviaciones estándar de las dos variables. Matemáticamente, se calcula de la siguiente manera:</p>
        <Latex>{'$$ r_{xy} =\n' +
          '  \\frac{ \\sum_{i=1}^{n}(x_i-\\bar{x})(y_i-\\bar{y}) }{%\n' +
          '        \\sqrt{\\sum_{i=1}^{n}(x_i-\\bar{x})^2}\\sqrt{\\sum_{i=1}^{n}(y_i-\\bar{y})^2}} $$'}</Latex>

        <p>Donde:</p>


        <p><Latex>{'$ x_i $'}</Latex> y <Latex>{'$ y_i $'}</Latex> son los valores de las dos variables en cada observación.</p>

        <p><Latex>{'$ \\bar{x} $'}</Latex> y <Latex>{'$ \\bar{y} $'}</Latex> son las medias de las dos variables, respectivamente.</p>
        <p>El coeficiente de correlación de Pearson es una herramienta útil para analizar la relación lineal entre dos variables y determinar si existe una asociación entre ellas. Se utiliza ampliamente en diversas áreas, como la
          investigación científica, la economía, la psicología, la sociología y muchas otras, para entender cómo se comportan dos variables en conjunto. Sin embargo, es importante destacar que el coeficiente de correlación de Pearson solo
          mide la relación lineal y no captura otros tipos de relaciones no lineales entre las variables.</p>

      </Modal.Body>
    </Modal>
  </>
}
