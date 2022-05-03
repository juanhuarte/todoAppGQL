import React from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";

function App() {
  return (
    <div className="App">
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
    </div>
  );
}

export default App;
