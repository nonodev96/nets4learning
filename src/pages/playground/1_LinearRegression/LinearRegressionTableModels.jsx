import { Table } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import React from "react";


export default function LinearRegressionTableModels({ listModels }) {
  const prefix = "generator.table-models."

  const { t } = useTranslation()

  return <>
    <Table size={"sm"} striped={true} bordered={false} hover={true} responsive={true}>
      <thead>
      <tr>
        <th>{t(prefix + "Learning rate")}</th>
        <th>{t(prefix + "Test size")}</th>
        <th>{t(prefix + "Nº of epochs")}</th>
        <th>{t(prefix + "ID optimizer")}</th>
        <th>{t(prefix + "ID loss")}</th>
        <th>{t(prefix + "ID metrics")}</th>
        <th>{t(prefix + "Layers")}</th>
      </tr>
      </thead>

      <tbody>
      {listModels.map((item, index) => {
        return <tr key={index}>
          <td>{item.params_training.learning_rate * 100}%</td>
          <td>{item.params_training.test_size * 100}%</td>
          <td>{item.params_training.n_of_epochs}</td>
          <td>{item.params_training.id_optimizer}</td>
          <td>{item.params_training.id_loss}</td>
          <td>{item.params_training.list_id_metrics.join(", ")}</td>
          <td>{item.list_layers.map((value, index) => {
            return (
              <span key={index} style={{ fontFamily: "monospace" }}>
                <small>{value.units.toString().padStart(2, "0")} - {value.activation}</small><br />
              </span>
            )
          })}</td>
        </tr>
      })}
      </tbody>
    </Table>
  </>
}