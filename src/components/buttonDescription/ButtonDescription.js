import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./ButtonDescription.css";

export default function ButtonDescription(props) {
  const { data } = props;

  return (
    <>
      <Container>
        <h3 className="titulos">{data.text}</h3>
        <Row className="btns-description">
          {data.buttons.map((a, i) => {
            return (
              <Col className="col-description" key={i}>
                <Button className="btn-custom-description" key={i} onClick={a.accion}>
                  {a.Title}
                </Button>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}


