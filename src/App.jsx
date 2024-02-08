import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
// components
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
// auth
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
// Todos
import TodoMain from "./components/TodoMain";
// Metrics
import MetricsMain from "./components/MetricsMain";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/metrics"
          element={<MetricsMain />}
        />
        <Route
          path="/todos"
          element={<TodoMain />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </Router>
  );
}

export default App;
