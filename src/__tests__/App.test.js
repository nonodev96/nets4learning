import { cleanup } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/setup/utils'
import TestPageEasy from '@pages/TestPageEasy'
import App from '@/App'

describe('App', () => {

  afterEach(cleanup)

  test('renders App', () => {
    const { getByText } = renderWithRouter(<App />)
    expect(getByText(/Loading\.\.\./i)).toBeInTheDocument()
  })

  test('renders TestPage', () => {
    const { getByText } = renderWithRouter(<TestPageEasy />)
    expect(getByText(/TestPage-Easy/i)).toBeInTheDocument()
  })

})