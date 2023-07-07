import { waitFor, cleanup } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/setup/utils'
import App from '@/App'
import i18n from '@/i18n'

describe('LinearRegression', () => {

  beforeEach(async () => {
    await i18n.init()
  })
  afterEach(cleanup)

  it('renders ModelReviewLinearRegression Review 0', async () => {
    const { getByText } = renderWithRouter(<App />, { path: ['playground', '1', '0', 'SALARY'] })
    await waitFor(() => {
      expect(getByText(/Card Title/i)).toBeInTheDocument()
    })
  })

})
