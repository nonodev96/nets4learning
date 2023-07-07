import { render } from '@testing-library/react'
import EasyTest from '@components/EasyTest'

describe('EasyTest', () => {
  test('renders EasyTest', () => {
    const { getByText } = render(<EasyTest />)
    expect(getByText(/EasyTest/)).toBeInTheDocument()
  })
})