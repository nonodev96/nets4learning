import { render, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/setup/utils'
import App from '@/App'

describe('Tests for Pages', () => {

  // test('App / TestPage', () => {
  //   const { getByText } = renderWithRouter(<App />, { path: ['test-page'] })
  //   expect(getByText(/TestPage/i)).toBeInTheDocument()
  // })

  test('App / TestPage with lazy load', async () => {
    const { getByText } = renderWithRouter(<App />, { path: ['test-page-lazy'] })

    await waitFor(() => {
      expect(getByText(/TestPage/i)).toBeInTheDocument()
    })
  })

  // test('App / TestPage as component', async () => {
  //   const { getByText } = render(<TestPage />)
  //   expect(getByText(/TestPage/i)).toBeInTheDocument()
  // })
})
