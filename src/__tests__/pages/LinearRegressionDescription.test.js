import { waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/setup/utils'
import App from '@/App'

describe('LinearRegressionDescription', () => {

  test('App / DescriptionLinearRegression', async () => {
    const { getByTestId } = renderWithRouter(<App />, { path: ['playground', 'description-linear-regression'] })
    await waitFor(() => expect(getByTestId('Test-DescriptionLinearRegression')).toBeInTheDocument())
  })
})