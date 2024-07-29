import React from 'react'
import { waitFor, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '@/__tests__/setup/utils'
import App from '@/App'
// const App = React.lazy(() => import('@/App'))


describe('LinearRegression', () => {
  test('App / ModelReviewLinearRegression Review SALARY', async () => {
    const { getByTestId, debug: _debug } = renderWithRouter(<App />, { path: ['home']})
    // Seleccionamos el botón de Regresión lineal
    const HTML_InitialMenu = await waitFor(() => getByTestId('Test-InitialMenu'))
    expect(HTML_InitialMenu).toBeInTheDocument()
    // _debug()

    const Button_InitialMenu_LinearRegression = getByTestId('Test-InitialMenu-LinearRegression')
    await waitFor(() => fireEvent.click(Button_InitialMenu_LinearRegression))

    // Seleccionamos el botón de Modelos de Regresión lineal
    const Button_GoTo_SelectModel_LinearRegression = await waitFor(() => getByTestId('Test-GoTo-SelectModel-LinearRegression'))
    await waitFor(() => fireEvent.click(Button_GoTo_SelectModel_LinearRegression))

    // Esperamos a que se cargue el menu de selección de modelos
    await waitFor(() => getByTestId('Test-MenuSelectModel'))

    // Cambiamos el selector de los modelos a DATASET_SALARY
    const Select_SelectModel = await waitFor(() => getByTestId('Test-MenuSelectModel-Select'))
    await waitFor(() => fireEvent.change(Select_SelectModel, { target: { value: 'SALARY' } }))

    // Cargamos la nueva página con el modelo de regresión lineal con el conjunto de datos de SALARY
    const Button_Submit_GoTo_ModelReviewLinearRegression = await waitFor(() => getByTestId('Test-MenuSelectModel-Submit'))
    await waitFor(() => fireEvent.click(Button_Submit_GoTo_ModelReviewLinearRegression))

    await waitFor(() => expect(getByTestId('Test-ModelReviewLinearRegression')).toBeInTheDocument())
  })

})
