import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import './polyfills'
// import reportWebVitals from './reportWebVitals'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App'
import './i18n'

const container = document.getElementById('root')
const root = createRoot(container)
ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID)
root.render(<App />)

if (process.env.REACT_APP_ENVIRONMENT === 'development') {
  // Learn more: https://bit.ly/CRA-vitals
  // reportWebVitals(console.debug)
}
