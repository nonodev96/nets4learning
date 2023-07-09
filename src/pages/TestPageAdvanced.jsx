import { Card, Table } from 'react-bootstrap'
import EasyTestComponent from '@components/EasyTestComponent'
import { useParams } from 'react-router'

export default function TestPageAdvanced () {

  const { id, option, example } = useParams()
  return <>
    <Card>
      <Card.Header><h3>TestPage-Advanced</h3></Card.Header>
      <Card.Body>
        <p><span data-testid={'Test-TestPageAdvanced-id'}>{id}</span></p>
        <p><span data-testid={'Test-TestPageAdvanced-option'}>{option}</span></p>
        <p><span data-testid={'Test-TestPageAdvanced-example'}>{example}</span></p>
      </Card.Body>
    </Card>
  </>
}