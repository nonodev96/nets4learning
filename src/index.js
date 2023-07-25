import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import './polyfills'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './i18n'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.REACT_APP_ENVIRONMENT === 'development') {
  reportWebVitals(console.debug)
}