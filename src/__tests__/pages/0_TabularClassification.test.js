import { waitFor, screen } from '@testing-library/react'
import { renderWithRouter } from './../setup/utils'
import App from '@/App'

describe('ModelReviewTabularClassification Review', () => {

  it('renders ModelReviewTabularClassification Review 0', async () => {
    const { getByText } = renderWithRouter(<App />, { path: ['playground', '0', '0', '1'] })
    await waitFor(() => {
      expect(screen.getByText(/pages.playground.0-tabular-classification.general.model/i)).toBeInTheDocument()
    })
  })

})