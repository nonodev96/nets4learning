import React from "react";

export default function TabularClassificationCustomDatasetManual(){
  return <>
    <details>
      <summary style={{ fontSize: "1.5em" }}>Editor de las capas</summary>
      <p>
        Se pueden editar las capas de la red neuronal, puedes agregar tantas como desees pulsando el botón "Añadir capa" al inicio o al final.
      </p>
      <ul>
        <li>
          <b>Unidades de la capa</b>:<br/>
          Cada unidad en una capa está conectada a todas las unidades de la capa anterior y de la capa siguiente. <br/>
          Cada unidad en una capa tiene un conjunto de pesos asociados que determinan la fuerza y dirección de la señal que se transmite entre las unidades. <br/>
          Podemos editar el número de entradas y salidas de la capa.
        </li>
        <li>
          <b>Función de activación</b>:<br/>
          La función de activación en una capa de una red neuronal se refiere a la función matemática que se aplica a la salida de cada unidad en la capa, antes de pasar la señal a la capa siguiente, podemos editar cada una
          de las funciones de activación de todas las capas.
        </li>
      </ul>
    </details>

    <details>
      <summary style={{ fontSize: "1.5em" }}>Editor de hiperparámetros</summary>
      <p>
        Se pueden editar los parámetros generales necesarios para la creación del modelo. <br/>
        Estos parámetros son:
      </p>
      <ul>
        <li>
          <b>Tasa de aprendizaje</b>:<br/>
          Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el
          entrenamiento.
        </li>
        <li>
          <b>Número de iteraciones</b>:<br/>
          Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar).
        </li>
        <li>
          <b>Tamaño del conjunto de pruebas</b>:<br/>
          Porcentaje del conjunto de datos que se va a usar para el entrenamiento y la evaluación.
        </li>
        <li>
          <b>Optimizador</b>:<br/>
          Es una función que como su propio nombre indica se usa para optimizar los modelos. <br/>
          Esto es frecuentemente usado para evitar estancarse en un máximo local.
        </li>
        <li>
          <b>Función de pérdida</b>:<br/>
          Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados.
        </li>
        <li>
          <b>Función de métrica</b>:<br/>
          Es la evaluación para valorar el rendimiento de un modelo de aprendizaje automático.
        </li>
      </ul>
    </details>

    <details>
      <summary style={{ fontSize: "1.5em" }}>Información de hiperparámetros</summary>
      <ul>
        <li>
          <b>Tasa de aprendizaje</b>:<br/>
          La tasa de aprendizaje es un parámetro que determina cuánto se deben actualizar los pesos de la red neuronal en función del error calculado durante el entrenamiento.
        </li>
        <li>
          <b>Número de iteraciones</b>:<br/>
          El número de iteraciones se refiere al número de veces que se presentan los datos de entrenamiento a la red neuronal durante el proceso de entrenamiento. Cada iteración implica una actualización de los pesos de la
          red en función del error calculado.
        </li>
        <li>
          <b>Tamaño del conjunto de pruebas</b>:<br/>
          El tamaño del conjunto de pruebas se refiere a la cantidad de datos utilizados para evaluar el rendimiento de la red neuronal después del entrenamiento. Este conjunto de datos no se utiliza en el entrenamiento de la
          red neuronal y se utiliza para medir la capacidad de la red de generalizar a datos nuevos.
        </li>
        <li>
          <b>Optimizador</b>:<br/>
          El optimizador es un algoritmo utilizado para actualizar los pesos de la red neuronal en función del error calculado durante el entrenamiento. Algunos ejemplos de optimizadores son el Descenso del Gradiente
          Estocástico (SGD), el Adam y el Adagrad.
        </li>
        <li>
          <b>Función de pérdida</b>:<br/>
          La función de pérdida es una medida del error entre las predicciones de la red neuronal y las salidas reales. Se utiliza para optimizar la red neuronal durante el entrenamiento y existen diferentes funciones de
          pérdida, como la Entropía Cruzada y el Error Cuadrático Medio.
        </li>
      </ul>
    </details>

    <details>
      <summary style={{ fontSize: "1.5em" }}>Crear y entrenar modelo</summary>
      <p>
        Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón "Crear y entrenar modelo".
      </p>
      <p>
        Si hemos entrenado el modelo con la función de métrica <i>Accuracy</i> nos aparecerá dos graficas en el visor.
        La más relevante para nosotros seá la de abajo, ya que en TensorFlow.js, <i>acc</i> y <i>val_acc</i> son métricas de evaluación comúnmente utilizadas en el entrenamiento de modelos de redes neuronales. <br/>
        <i>acc</i> representa la precisión (accuracy) del modelo en el conjunto de datos de entrenamiento. La precisión se define como el número de predicciones correctas dividido por el número total de predicciones. <br/>
        <i>val_acc</i> representa la precisión del modelo en el conjunto de datos de validación. La validación se utiliza para evaluar la capacidad del modelo para generalizar a nuevos datos que no han sido vistos durante el
        entrenamiento. <br/>
      </p>
      <p>
        La precisión de validación es importante para detectar el sobreajuste (<i>overfitting</i>) del modelo, que se produce cuando el modelo se ajusta demasiado a los datos de entrenamiento y no generaliza bien a nuevos
        datos.
      </p>
      <p>
        En resumen, <b>acc</b> se refiere a la precisión en el conjunto de datos de entrenamiento y <b>val_acc</b> se refiere a la precisión en el conjunto de datos de validación. Ambas métricas son importantes para evaluar
        la capacidad del modelo para generalizar a nuevos datos.
      </p>
      <p>
        Si todo ha sido correcto se añadirá una nueva entrada a la lista de modelos generados con el conjunto de datos seleccionado, se nos permitirá cargar en memoria modelos entrenados anteriormente.
      </p>
    </details>

    <details>
      <summary style={{ fontSize: "1.5em" }}>Exportar modelo</summary>
      <p>
        Si hemos creado el modelo correctamente se añadirá una entrada en la tabla de modelos generados, se nos permite exportar los modelos generados y guardarlos localmente.
      </p>
    </details>

    <details>
      <summary style={{ fontSize: "1.5em" }}>Predicción</summary>
      <p>
        El formulario final nos permite seleccionar las características principales que se usan para determinar la clase.
      </p>
      <p>
        El valor de salida será un índice de la lista de clases, para realizar la predicción de la clase en función de las características debemos pulsar el botón "Ver resultado".
      </p>
    </details>
  </>
}