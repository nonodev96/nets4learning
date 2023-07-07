import { cleanup } from '@testing-library/react'
import TestPage from '@pages/TestPage'
import App from '../App'
import i18n from '../i18n'
import { renderWithRouter } from '@/__tests__/setup/utils'

describe('App', () => {

  beforeEach(async () => {
    await i18n.init()
  })
  afterEach(cleanup)

  test('renders App', () => {
    const { getAllByText } = renderWithRouter(<App />)
    expect(getAllByText(/Loading\.\.\./i)[0]).toBeInTheDocument()
  })

  test('renders TestPage', () => {
    const { getByText } = renderWithRouter(<TestPage />)
    expect(getByText(/TestPage/i)).toBeInTheDocument()
  })

})