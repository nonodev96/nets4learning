import N4LNavbar from "../../components/header/N4LNavbar";
import { Accordion, Col, Container, Row, Table } from "react-bootstrap";
import N4LFooter from "../../components/footer/N4LFooter";
import React from "react";

export default function Glossary(props) {
  console.log("render")
  return (
    <>
      <N4LNavbar/>
      <main className={"mb-3"} data-title={"Glossary"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>Glosario</h1>
            </Col>
            <Col xl={12} className={"mt-3"}>
              <Accordion alwaysOpen defaultValue={"classification-tabular"}>
                <Accordion.Item eventKey={"classification-tabular"}>
                  <Accordion.Header><h3>Descripción clasificación tabular</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      La clasificación tabular es un tipo de aprendizaje supervisado en el que se utiliza un conjunto de datos etiquetados para entrenar un modelo de aprendizaje automático que pueda predecir la clase de un nuevo conjunto de
                      datos. En la clasificación tabular, los datos de entrada y salida se representan en forma de una tabla con filas y columnas, donde cada fila representa una instancia o ejemplo de los datos, y cada columna representa
                      una
                      característica o atributo de los datos.
                    </p>
                    <p>
                      Por ejemplo, si se quiere predecir si un cliente de un banco es solvente o no, las características o atributos que se pueden utilizar son: ingresos, deudas, historial crediticio, edad, etc. En la clasificación tabular,
                      cada instancia o ejemplo del conjunto de datos tendrá valores para cada una de estas características y una etiqueta que indica si el cliente es solvente o no.
                    </p>
                    <p>
                      Una vez que se tiene un conjunto de datos etiquetados, se utiliza un algoritmo de aprendizaje automático para entrenar un modelo que pueda predecir la etiqueta de nuevos conjuntos de datos. Este modelo puede ser
                      utilizado para realizar predicciones precisas y rápidas sobre nuevas instancias de datos.
                    </p>
                    <p>
                      La clasificación tabular es una técnica muy útil para resolver problemas de clasificación en una amplia variedad de campos, como la medicina, el comercio electrónico, la banca, la seguridad y muchos otros.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"objects-detection"}>
                  <Accordion.Header><h3>Descripción identificación de objetos</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      La identificación de objetos en redes neuronales es una técnica utilizada en el campo del aprendizaje automático y la visión por computadora para detectar y reconocer objetos en imágenes o videos. Es una tarea
                      importante
                      en el análisis de imágenes y es utilizada en aplicaciones como el reconocimiento de rostros, el seguimiento de objetos en tiempo real, la clasificación de objetos en imágenes médicas y la detección de objetos en
                      vehículos autónomos.
                    </p>
                    <p>
                      Las redes neuronales utilizadas para la identificación de objetos son modelos de aprendizaje profundo que se entrenan en conjuntos de datos etiquetados. El proceso de entrenamiento implica proporcionar a la red
                      neuronas
                      una gran cantidad de imágenes etiquetadas, y ajustar los pesos de las conexiones entre las neuronas para que la red pueda identificar objetos en nuevas imágenes con alta precisión.
                    </p>
                    <p>
                      Una vez que la red neuronal ha sido entrenada, se utiliza para identificar objetos en nuevas imágenes. La red examina la imagen y, mediante el procesamiento de múltiples capas, extrae características importantes que se
                      utilizan para identificar los objetos de interés. Luego, la red utiliza estas características para asignar una etiqueta a cada objeto detectado en la imagen.
                    </p>
                    <p>
                      En resumen, la identificación de objetos en redes neuronales es una técnica importante en la visión por computadora y el aprendizaje automático que se utiliza para detectar y reconocer objetos en imágenes y videos. Se
                      basa en el uso de redes neuronales profundas entrenadas en conjuntos de datos etiquetados para identificar y clasificar objetos en nuevas imágenes con alta precisión.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"classification-imagen"}>
                  <Accordion.Header><h3>Descripción clasificador de imágenes</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      El clasificador de imágenes es una técnica utilizada en las redes neuronales para clasificar imágenes en diferentes categorías o etiquetas. El objetivo de un clasificador de imágenes es tomar una imagen de entrada y
                      predecir a qué clase pertenece, basándose en un conjunto de categorías o etiquetas predefinidas.
                    </p>
                    <p>
                      En el aprendizaje profundo, los clasificadores de imágenes se basan en las redes neuronales convolucionales (CNN, por sus siglas en inglés), que son una arquitectura especializada para procesar imágenes. Estas redes
                      neuronales tienen múltiples capas y operaciones de convolución que les permiten extraer características importantes de las imágenes, como bordes, formas y texturas.
                    </p>
                    <p>
                      Para entrenar un clasificador de imágenes, se utiliza un conjunto de datos etiquetados que contiene imágenes y sus respectivas etiquetas de clase. Luego, se entrena la red neuronal utilizando este conjunto de datos
                      para
                      que aprenda a identificar patrones en las imágenes y asociarlos con las etiquetas de clase correspondientes.
                    </p>
                    <p>
                      Una vez que la red neuronal ha sido entrenada, se puede utilizar para clasificar nuevas imágenes en diferentes categorías. El clasificador de imágenes examina la imagen de entrada y la procesa a través de la red
                      neuronal
                      para extraer características importantes y predecir a qué clase pertenece la imagen.
                    </p>
                    <p>
                      En resumen, el clasificador de imágenes en las redes neuronales es una técnica que utiliza las redes neuronales convolucionales para clasificar imágenes en diferentes categorías o etiquetas. Se basa en el uso de un
                      conjunto de datos etiquetados para entrenar la red neuronal y en la extracción de características importantes de las imágenes para predecir a qué clase pertenece una nueva imagen de entrada.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <hr/>
              <Accordion>
                <Accordion.Item eventKey={"functions-activations"}>
                  <Accordion.Header><h3>Funciones de activación</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Una función de activación es una función matemática utilizada en una red neuronal artificial para determinar la salida de una neurona o de un conjunto de neuronas en función de la entrada recibida.
                      La función de activación introduce no linealidad en la red neuronal, lo que permite a la red aprender patrones más complejos en los datos de entrada.
                      Ejemplos comunes de funciones de activación son la función sigmoidea, la función ReLU y la función tangente hiperbólica.
                    </p>
                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Características</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th>Softmax</th>
                        <td>Transforma las salidas a una representación en forma de probabilidades, de forma que la suma de todas las probabilidades da 1</td>
                        <td>
                          <ol>
                            <li>Acotada entre 0 y 1</li>
                            <li>Buena en capas finales</li>
                            <li>Utilizada para normalizar tipo multiclase</li>
                          </ol>
                        </td>
                      </tr>
                      <tr>
                        <th>Sigmoid</th>
                        <td>Transforma los valores de entrada donde los más altos tienden a 1 y los valores más bajos tienden a 0</td>
                        <td>
                          <ol>
                            <li>Acotada entre 0 y 1</li>
                            <li>Lenta convergencia</li>
                            <li>Buena en capas finales</li>
                          </ol>
                        </td>
                      </tr>
                      <tr>
                        <th>ReLU</th>
                        <td>Transforma los valores de entrada dejando a cero los valores negativos y dejando tal como estaban los datos positivos</td>
                        <td>
                          <ol>
                            <li>No está acotada</li>
                            <li>Buen desempeño con redes convolucionales</li>
                          </ol>
                        </td>
                      </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"functions-optimizers"}>
                  <Accordion.Header><h3>Funciones de optimización</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Una función de optimización es una técnica matemática utilizada para minimizar o maximizar una función objetivo.
                      En el contexto del aprendizaje automático, las funciones objetivo suelen ser funciones de error que miden la discrepancia entre la salida de la red neuronal y los valores de salida deseados para un conjunto de datos de
                      entrenamiento dado.
                      La función de optimización ajusta los parámetros de la red neuronal para minimizar la función objetivo y, por lo tanto, mejorar su capacidad para hacer predicciones precisas en nuevos datos de entrada.
                      Ejemplos comunes de funciones de optimización son el descenso del gradiente estocástico y el algoritmo de Adam.
                    </p>

                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>Función</th>
                        <th>Referencia</th>
                        <th>Descripción</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th>SGD</th>
                        <td>Descenso del gradiente estocástico <br/>(Instituto Tecnológico Autónomo de México, 2017)</td>
                        <td>el descenso del gradiente es un algoritmo que estima dónde una función genera sus valores más bajos. En el caso de que el modelo de aprendizaje automático sea de gran escala este cálculo puede ser muy costoso.
                          Debido a esto surge el descenso del gradiente estocástico que usa una constante y por consiguiente el número de gradientes a calcular es fijo.
                        </td>
                      </tr>
                      <tr>
                        <th>Momentum</th>
                        <td></td>
                        <td>Es una variación de la función anterior. Define un valor que acelera el descenso del gradiente si el signo del gradiente es el mismo durante diferentes épocas.</td>
                      </tr>
                      <tr>
                        <th>AdaGrad</th>
                        <td>(Velasco, 2020)</td>
                        <td>Introduce una variación en el concepto de tasa de entrenamiento. Esta función escala y adapta este valor para cada peso respecto del gradiente acumulado en cada iteración.</td>
                      </tr>
                      <tr>
                        <th>Adadelta</th>
                        <td>(Velasco, 2020)</td>
                        <td>Es una variación de AdaGrad en la que se restringe el cálculo de la tasa de entrenamiento de cada peso a una ventana de tamaño fijo de los últimos n gradientes en vez de hacerlo con el gradiente acumulado de cada
                          iteración.
                        </td>
                      </tr>
                      <tr>
                        <th>RMSProp</th>
                        <td>Propagación de raíz cuadrática media (Root Mean Square Propagation) <br/> (Velasco, 2020)</td>
                        <td>Este algoritmo mantiene un factor de entrenamiento diferente para cada dimensión, pero el escalado del factor del entrenamiento se realiza dividiéndolo por la media del declive exponencial del cuadrado de los
                          gradientes.
                        </td>
                      </tr>
                      <tr>
                        <th>Adam</th>
                        <td>Estimación adaptativa del mo (Adaptive moment estimation) <br/> (Velasco, 2020)</td>
                        <td>Es una combinación de <i>AdaGrad</i> y <i>RMSProp</i>. Se mantiene un factor de entrenamiento por parámetro y se calcula <i>RMSProp</i>, además cada factor de entrenamiento se ve afectado por
                          el <i>momentum</i> del gradiente.
                        </td>
                      </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"functions-losses"}>
                  <Accordion.Header><h3>Funciones de pérdida</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>
                      En aprendizaje automático, una función de pérdida (también llamada función de costo) es una medida que cuantifica la discrepancia entre la salida predicha por un modelo y la salida real o deseada.
                      En otras palabras, la función de pérdida mide qué tan bien el modelo se ajusta a los datos de entrenamiento.
                    </p>
                    <p>
                      El objetivo de un algoritmo de aprendizaje automático es minimizar la función de pérdida, lo que significa encontrar el conjunto de parámetros del modelo que mejor se ajuste a los datos de entrenamiento.
                      Por lo tanto, la elección de la función de pérdida es muy importante, ya que puede afectar la capacidad del modelo para aprender correctamente los patrones en los datos y hacer predicciones precisas en nuevos datos.
                    </p>
                    <p>
                      Existen diferentes funciones de pérdida para diferentes tipos de problemas de aprendizaje automático, como la regresión, la clasificación binaria y la clasificación multiclase.
                      Ejemplos comunes de funciones de pérdida incluyen el error cuadrático medio (MSE) para la regresión, la entropía cruzada binaria para la clasificación binaria y la entropía cruzada categórica para la clasificación
                      multiclase.
                    </p>
                    <p>
                      En tensorflow.js hay diferentes funciones de pérdida y la aplicación de cada una de ellas depende del tipo de problema que queramos afrontar.
                    </p>
                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>Función</th>
                        <th>Referencia</th>
                        <th>Descripción</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th>AbsoluteDifference</th>
                        <td>Diferencia absoluta <br/>(Acervolima, s.f.)</td>
                        <td>Calcula en valor absoluto la distancia al objetivo. Esta función es utilizada en problemas de regresión.</td>
                      </tr>
                      <tr>
                        <th>ComputeWeightedLoss</th>
                        <td>Media ponderada <br/>(Acervolima, s.f.)</td>
                        <td>Calcula la pérdida ponderada entre dos tensores dados.</td>
                      </tr>
                      <tr>
                        <th>CosineDistance</th>
                        <td>Distancia del coseno <br/>(Acervolima, s.f.)</td>
                        <td>Calcula la pérdida aplicando el coseno de la distancia entre dos tensores.</td>
                      </tr>
                      <tr>
                        <th>HingeLoss</th>
                        <td>Pérdida de bisagra <br/>(Rennie & Srebro, 2005)</td>
                        <td>Calcula la pérdida de bisagra entre dos tensores. Se aplica en problemas de clasificación.</td>
                      </tr>
                      <tr>
                        <th>HuberLoss</th>
                        <td>(Pérdida Huber)</td>
                        <td>Es usada en problemas de regresión, esta calcula la pérdida provocada por el procedimiento de estimación.</td>
                      </tr>
                      <tr>
                        <th>LogLoss</th>
                        <td>Pérdida logarítmica <br/>(Shen, 2005)</td>
                        <td><i>LogLoss</i> o <i>Logistic Loss</i> es una función convexa que crece linealmente para números negativos y la hace poco sensible a valores atípicos. Calcula la pérdida logarítmica entre dos tensores.</td>
                      </tr>
                      <tr>
                        <th>MeanSquaredError</th>
                        <td>Error cuadrático medio <br/>(Acervolima, s.f.)</td>
                        <td>Calcula de forma geométrica la distancia al cuadrado al objetivo, esta función es utilizada en problemas de regresión.</td>
                      </tr>
                      <tr>
                        <th>CategoricalCrossEntropy</th>
                        <td>(Acervolima, s.f.)</td>
                        <td>Mide la distancia entre distribuciones de probabilidad. Es aplicada en redes cuya capa de salida es una probabilidad.</td>
                      </tr>
                      <tr>
                        <th>SigmoidCrossEntropy</th>
                        <td>(Acervolima, s.f.)</td>
                        <td>Se trata de una variante de la función <i>CategoricalCrossEntropy</i>, en este caso calcula la pérdida en un valor entre 0 y 1.</td>
                      </tr>
                      <tr>
                        <th>SoftmaxCrossEntropy</th>
                        <td>(Bendersky, 2016)</td>
                        <td>Se aplica una combinación de las funciones <i>softmax</i> y <i>CrossEntropy</i> calculando la pérdida de la red.</td>
                      </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"functions-metrics"}>
                  <Accordion.Header><h3>Funciones de métrica</h3></Accordion.Header>
                  <Accordion.Body>
                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>Función</th>
                        <th>Referencia</th>
                        <th>Descripción</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th>BinaryAccuracy</th>
                        <td>Precisión binaria <br/>(Acervolima, s.f.)</td>
                        <td>Calcula la frecuencia con la que las predicciones coinciden con las etiquetas binarias.</td>
                      </tr>
                      <tr>
                        <th>BinaryCrossentropy</th>
                        <td>Entropía cruzada binaria <br/>(Saxena, 2021)</td>
                        <td>Es el promedio negativo del logaritmo de las probabilidades predichas que se han corregido.</td>
                      </tr>
                      <tr>
                        <th>CategoricalAccuracy</th>
                        <td>Exactitud categórica</td>
                        <td>Calcula la frecuencia con la que las predicciones coinciden con las etiquetas one-hot.</td>
                      </tr>
                      <tr>
                        <th>CategoricalCrossentropy</th>
                        <td>Entropía cruzada categórica</td>
                        <td>Calcula la métrica de entropía cruzada entre las etiquetas y las predicciones.</td>
                      </tr>
                      <tr>
                        <th>CosineProximity</th>
                        <td>Proximidad del coseno</td>
                        <td>Calcula entre las etiquetas y las predicciones el coseno de la proximidad. Normalmente se obtienen valores negativos.</td>
                      </tr>
                      <tr>
                        <th>MeanAbsoluteError</th>
                        <td>Error absoluto medio</td>
                        <td>En estadística, es una medida de la diferencia entre dos variables continuas, aplicada a los modelos de aprendizaje automático estas variables son las etiquetas y las predicciones.</td>
                      </tr>
                      <tr>
                        <th>MeanAbsolutePercentageError</th>
                        <td>Porcentaje de error absoluto medio</td>
                        <td>De igual forma que <i>MeanAbsoluteError</i> calcula la diferencia entre las etiquetas y las predicciones, pero en este caso con un porcentaje.</td>
                      </tr>
                      <tr>
                        <th>MeanSquaredError</th>
                        <td>Error cuadrático medio</td>
                        <td>Determina el error cuadrático medio entre las etiquetas y las predicciones.</td>
                      </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"layers"} style={{ display: 'none' }}>
                  <Accordion.Header><h3>Tipos de capas</h3></Accordion.Header>
                  <Accordion.Body>
                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th>Dense</th>
                        <td>Esta función se utiliza para crear capas completamente conectadas, en las que cada salida depende de cada entrada.</td>
                      </tr>
                      <tr>
                        <th>Convolutional</th>
                        <td>Existen tres tipos de capas Convolutional, 1d, 2d y 3d. Estas capas nos permiten crear un núcleo de convolución que se transforma con los datos de entrada sobre el número de dimensiones elegido según la capa.
                        </td>
                      </tr>
                      <tr>
                        <th>Merge</th>
                        <td>Se trata de un conjunto de funciones que definen diferentes operaciones como añadir o concatenar tensores a una capa.</td>
                      </tr>
                      <tr>
                        <th>Normalization</th>
                        <td>Nos permite normalizar la activación de la capa anterior es decir mantiene la activación media cerca de 0 y la desviación estándar de activación cerca de 1.</td>
                      </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"normalization"} style={{ display: 'none' }}>
                  <Accordion.Header><h3>Normalización</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>La normalización de datos es un paso importante en el procesamiento de datos para redes neuronales. La normalización se refiere a la transformación de los datos de entrada para que tengan una escala
                      común.</p>
                    <p>La normalización de datos se utiliza en redes neuronales por varias razones:</p>
                    <ol>
                      <li><b>Mejora la estabilidad numérica</b>: Al normalizar los datos, los valores de entrada se escalan a un rango más pequeño y manejable, lo que ayuda a evitar problemas numéricos como la explosión del gradiente.</li>
                      <li><b>Mejora la velocidad de entrenamiento</b>: La normalización de datos puede ayudar a que los algoritmos de aprendizaje automático converjan más rápido, ya que los valores de entrada se encuentran en un rango más
                        pequeño y uniforme, lo que permite que el optimizador pueda ajustar los pesos más fácilmente.
                      </li>
                      <li><b>Mejora la precisión del modelo</b>: La normalización de datos puede ayudar a mejorar la precisión del modelo. En algunos casos, la normalización de datos puede ayudar a reducir la cantidad de ruido en los datos
                        y
                        puede hacer que los patrones en los datos sean más visibles.
                      </li>
                      <li><b>Mejora la generalización del model</b>: La normalización de datos puede ayudar a reducir la varianza y mejorar la generalización del modelo. Al normalizar los datos, se puede hacer que el modelo sea más
                        resistente
                        a la presencia de valores atípicos y variaciones en los datos.
                      </li>
                    </ol>
                    <p>En resumen, normalizar los datos es una buena práctica en el procesamiento de datos para redes neuronales, ya que puede mejorar la estabilidad numérica, la velocidad de entrenamiento, la precisión del modelo y
                      la generalización del modelo.</p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </main>
      <N4LFooter/>
    </>
  )
}