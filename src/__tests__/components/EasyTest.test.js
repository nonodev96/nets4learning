import { render } from '@testing-library/react'
import EasyTestComponent from '@components/EasyTestComponent'

describe('EasyTest', () => {
  test('renders EasyTest', () => {
    const { getByText } = render(<EasyTestComponent />)
    expect(getByText(/EasyTestComponent/)).toBeInTheDocument()
  })
})