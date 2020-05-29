import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Logon from "./pages/Logon";
import Home from "./pages/Home";
import Cliente from "./pages/Cliente";
import Instrutor from "./pages/Instrutor";
import Aula from "./pages/Aula";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
      <Route path="/" exact component={Logon} />
      <Route path="/home" component={Home} />
      <Route path="/cliente" component={Cliente} />
      <Route path="/instrutor" component={Instrutor} />
      <Route path="/aula" component={Aula} />
      </Switch>
    </BrowserRouter>
  );
}
