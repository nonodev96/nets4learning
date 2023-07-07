import { renderWithRouter } from '@/__tests__/setup/utils'
import App from '@/App'

describe('Tests for TestPage', () => {
  test('TestPage', async () => {
    const { getByText } = renderWithRouter(<App />, { path: ['test-page'] })
    expect(getByText(/TestPage/i)).toBeInTheDocument()
  })
})
