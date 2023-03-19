import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation()
  return <>
    <Container>
      <Row>
        <Col>
          <div className="d-flex vh-100 justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className={"ms-3 mb-0"}>
              {t('loading')}...
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  </>
}