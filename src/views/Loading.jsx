import { Col, Container, Row } from "react-bootstrap";

export default function Loading(props) {
  return <>
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading...
          </div>
        </Col>
      </Row>
    </Container>
  </>
}