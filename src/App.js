import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter, Switch } from "react-router-dom";
import { Route } from "react-router";
import Home from "./components/Home";

import "./App.css";
import Test from "./components/testPage/Test";
import Training from "./components/training/Training";
import Editor from "./components/views/editor/Editor";
import NotFoundPage from "./components/views/notFound/NotFoundPage";
import Starting from "./components/views/starting/Starting";
import SecondMenu from "./components/views/secondMenu/SecondMenu";
import EditArchitecture from "./components/views/editArchitecture/EditArchitecture";
import UploadArchitectureMenu from "./components/views/uploadArcitectureMenu/UploadArchitectureMenu";
import UploadModelMenu from "./components/views/uploadModelMenu/UploadModelMenu";

function App() {
  const DOMAIN = process.env.REACT_APP_DOMAIN;
  return (
    <div className="body">
      <Router>
        <Switch>
          <Route exact path={DOMAIN + "/starting/"} component={Starting}></Route>
          {/* <Route exact path="/upload-architecture-custom/" component={}></Route> */}
          <Route exact path={DOMAIN + "/edit-architecture/:id/:tipo/:ejemplo"} component={EditArchitecture}></Route>
          <Route exact path={DOMAIN + "/select-dataset/:id"} component={UploadArchitectureMenu}></Route>
          <Route exact path={DOMAIN + "/select-model/:id"} component={UploadModelMenu}></Route>
          {/* <Route exact path="/upload-training-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-training/" component={}></Route> */}
          {/* <Route exact path="/upload-model-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-model/" component={}></Route> */}
          <Route exact path={DOMAIN + "/secondary/:id"} component={SecondMenu}></Route>
          <Route exact path={DOMAIN + "/editor/:id"} component={Editor}></Route>
          <Route exact path={DOMAIN + "/training"} component={Training}></Route>
          <Route exact path={DOMAIN + "/test"} component={Test}></Route>
          <Route exact path={DOMAIN} component={Home}></Route>

          <Route component={NotFoundPage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default withRouter(App);
