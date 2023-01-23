import React from "react";
import { withRouter, BrowserRouter, Switch } from "react-router-dom";
import { Route } from "react-router";
import Home from "./components/Home";

import "./App.css";
import Test from "./components/testPage/Test";
import Training from "./components/training/Training";
import Editor from "./views/editor/Editor";
import NotFoundPage from "./views/notFound/NotFoundPage";
import Starting from "./views/starting/Starting";
import SecondMenu from "./views/secondMenu/SecondMenu";
import EditArchitecture from "./views/editArchitecture/EditArchitecture";
import UploadArchitectureMenu from "./views/uploadArcitectureMenu/UploadArchitectureMenu";
import UploadModelMenu from "./views/uploadModelMenu/UploadModelMenu";

function App() {
  return (
    <div className="body">
      <BrowserRouter>
        <Switch>
          <Route exact path={"/starting/"} component={Starting}></Route>
          {/* <Route exact path="/upload-architecture-custom/" component={}></Route> */}
          <Route exact path={"/edit-architecture/:id/:tipo/:ejemplo"} component={EditArchitecture}></Route>
          <Route exact path={"/select-dataset/:id"} component={UploadArchitectureMenu}></Route>
          <Route exact path={"/select-model/:id"} component={UploadModelMenu}></Route>
          {/* <Route exact path="/upload-training-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-training/" component={}></Route> */}
          {/* <Route exact path="/upload-model-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-model/" component={}></Route> */}
          <Route exact path={"/secondary/:id"} component={SecondMenu}></Route>
          <Route exact path={"/editor/:id"} component={Editor}></Route>
          <Route exact path={"/training"} component={Training}></Route>
          <Route exact path={"/test"} component={Test}></Route>
          <Route exact path={"/"} component={Home}></Route>

          <Route component={NotFoundPage}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withRouter(App);
