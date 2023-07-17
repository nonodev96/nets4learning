import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'
import * as sk from 'scikitjs'

sk.setBackend(dfd.tensorflow)

const trainLinearModel = async (xTrain, yTrain) => {
  const model = tf.sequential()
  model.add(
    tf.layers.dense({
      inputShape: [xTrain.shape[1]],
      units     : xTrain.shape[1],
    })
  )
  model.add(tf.layers.dense({ units: 1 }))

  const trainLogs = []
  const lossContainer = document.getElementById('loss-cont')
  const accContainer = document.getElementById('acc-cont')
  await model.fit(xTrain, yTrain, {
    batchSize      : 32,
    epochs         : 100,
    shuffle        : true,
    validationSplit: 0.1,
    callbacks      : {
      onEpochEnd: async (epoch, logs) => {
        trainLogs.push({
          rmse    : Math.sqrt(logs.loss),
          val_rmse: Math.sqrt(logs.val_loss),
          mae     : logs.meanAbsoluteError$1,
          val_mae : logs.val_meanAbsoluteError$1,
        })
        await tfvis.show.history(lossContainer, trainLogs, ['rmse', 'val_rmse'])
        await tfvis.show.history(accContainer, trainLogs, ['mae', 'val_mae'])
      },
    },
  })
}