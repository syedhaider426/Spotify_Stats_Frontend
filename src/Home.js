import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Artist from "./components/Artist";
import Graph from "./Graph";

export default function Home() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/artist">
          <Artist />
        </Route>
        <Route path="/">
          <Graph />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
