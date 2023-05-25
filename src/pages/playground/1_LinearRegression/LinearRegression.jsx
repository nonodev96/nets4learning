import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { MODEL_AUTO_MPG } from "./models";

export default function LinearRegression() {


  const auto_mpg = new MODEL_AUTO_MPG()

  // TODO
  const handleSubmit_Play = async (event) => {
    event.preventDefault()
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit_Play} id={"LinearRegression"}>
              <Button onClick={() => auto_mpg.compile()}>Compile</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}