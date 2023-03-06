import React from "react";
import { withRouter, BrowserRouter, Switch } from "react-router-dom";
import { Redirect, Route, Router } from "react-router";

import Home from "./components/Home";
import NotFoundPage from "./views/notFound/NotFoundPage";
import UploadModelMenu from "./views/uploadModelMenu/UploadModelMenu";
import EditArchitecture from "./views/editArchitecture/EditArchitecture";
import UploadArchitectureMenu from "./views/uploadArcitectureMenu/UploadArchitectureMenu";
import InteractiveEditor from "./views/editor/InteractiveEditor";
import Manual from "./views/manual/Manual";

import "./App.css";

function App() {
  const REACT_APP_PATH = process.env.REACT_APP_PATH
  // console.log(process.env)
  return (
    <div className="body">
      <BrowserRouter basename={REACT_APP_PATH}>
        <Switch>
          <Route exact path={"/"} component={Home}></Route>
          <Route exact path={"/edit-architecture/:id/:tipo/:ejemplo"} component={EditArchitecture}></Route>
          <Route exact path={"/select-dataset/:id"} component={UploadArchitectureMenu}></Route>
          <Route exact path={"/select-model/:id"} component={UploadModelMenu}></Route>
          <Route exact path="/manual/" component={Manual}></Route>
          {/* <Route exact path={"/starting/"} component={Starting}></Route> */}
          {/* <Route exact path={"/secondary/:id"} component={SecondMenu}></Route> */}
          {/* <Route exact path={"/editor/:id"} component={Editor}></Route> */}
          {/* <Route exact path={"/training"} component={Training}></Route> */}
          {/* <Route exact path={"/test"} component={Test}></Route> */}
          {/* <Route exact path="/upload-training-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-training/" component={}></Route> */}
          {/* <Route exact path="/upload-model-custom/" component={}></Route> */}
          {/* <Route exact path="/edit-model/" component={}></Route> */}
          <Route exact path={"/test"} component={InteractiveEditor}></Route>
          <Route path="/404" component={NotFoundPage}/>
          <Redirect to="/404"></Redirect>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withRouter(App);
