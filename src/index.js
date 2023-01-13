import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import tema from "./themeConfig.js";
import { ThemeProvider } from "@mui/system";
import 'bootstrap/dist/css/bootstrap.min.css';


const app = (
  <ThemeProvider theme={tema}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ThemeProvider>
);


ReactDOM.render(app, document.getElementById("root"));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
