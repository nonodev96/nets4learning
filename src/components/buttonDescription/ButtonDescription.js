import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./ButtonDescription.css";

export default function ButtonDescription(props) {
  const { data } = props;

  return (
    <>
      <Row>
        <h3>{data.text}</h3>
        {data.buttons.map((a, i) => {
          return (
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} key={i}>
              <Button key={i} onClick={a.accion}>{a.Title}</Button>
            </Col>
          );
        })}
      </Row>
    </>
  );
}


