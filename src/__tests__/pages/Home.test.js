import { renderWithRouter } from '@/__tests__/setup/utils'
import i18n from '@/i18n'
import App from '@/App'

describe('Home', () => {
  beforeEach(async () => {
    await i18n.init()
  })

  test('renders Home', () => {
    const { getByText } = renderWithRouter(<App />)
    expect(getByText('welcome')).toBeInTheDocument()
  })
})