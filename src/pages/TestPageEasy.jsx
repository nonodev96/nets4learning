import { Card } from 'react-bootstrap'
import EasyTestComponent from '@components/EasyTestComponent'

export default function TestPageEasy () {
  return <>
    <Card>
      <Card.Header><h3>TestPage-Easy</h3></Card.Header>
      <Card.Body>

        <EasyTestComponent />

      </Card.Body>
    </Card>
  </>
}