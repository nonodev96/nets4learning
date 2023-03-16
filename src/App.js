import React, { useEffect, lazy, Suspense } from "react";
import { withRouter, BrowserRouter, Switch } from "react-router-dom";
import { Redirect, Route } from "react-router";
import ReactGA from 'react-ga4';

import "./App.css";
import Loading from "./views/Loading";

const Home = lazy(() => import( "./views/_home/Home.jsx"));

const MenuSelectModel = lazy(() => import( "./views/menu/MenuSelectModel"));
const MenuSelectDataset = lazy(() => import( "./views/menu/MenuSelectDataset"));
const Playground = lazy(() => import( "./views/playground/Playground"));
const Manual = lazy(() => import( "./views/manual/Manual"));
const Glossary = lazy(() => import( "./views/glossary/Glossary"));
const TermsAndConditions = lazy(() => import( "./views/terms/TermsAndConditions"));
const NotFoundPage = lazy(() => import( "./views/notFound/NotFoundPage"));

function App() {
  const REACT_APP_PATH = process.env.REACT_APP_PATH

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID)
  }, [])

  return (
    <div className="body">
      <BrowserRouter basename={REACT_APP_PATH}>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path={"/"} component={Home}></Route>
            <Route exact path={"/select-dataset/:id"} component={MenuSelectDataset}></Route>
            <Route exact path={"/select-model/:id"} component={MenuSelectModel}></Route>
            <Route exact path={"/playground/:id/:option/:example"} component={Playground}></Route>
            <Route exact path={"/manual/"} component={Manual}></Route>
            <Route exact path={"/glossary/"} component={Glossary}></Route>
            <Route exact path={"/terms-and-conditions/"} component={TermsAndConditions}></Route>
            <Route path="/404" component={NotFoundPage}/>
            <Redirect to="/404"></Redirect>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default withRouter(App);
