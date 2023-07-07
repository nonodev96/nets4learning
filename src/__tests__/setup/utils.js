import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

/**
 *
 * @param ui
 * @param {{basename?: string, path?: string[]}} route
 * @return {object}
 */
export const renderWithRouter = (ui, route = {}) => {
  if (route.basename === undefined) route.basename = '/nets4learning'
  if (route.path === undefined) route.path = []
  let slash = route.path.length > 0 ? '/' : ''
  const _address = route.basename + slash + route.path.join('/')

  window.history.pushState({}, 'Test page', _address)
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  }
}