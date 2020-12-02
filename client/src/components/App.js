import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./loginregister/Login";
import Signup from "./loginregister/Signup";
import DashBoard from "./dashBoard/dashBoard";
import Board from "./Board/Board";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact={true}>
            <div className="App">
              <header className="App-header">
                Welcome to Trello Clone <a href="/dashboard">Launch App</a>
              </header>
            </div>
          </Route>
          <Route path="/dashboard" exact={true}>
            <DashBoard />
          </Route>
          <Route path="/dashboard/:id/board" exact={true}>
            <Board />
          </Route>
          <Route path="/login" exact={true}>
            <Login />
          </Route>
          <Route path="/signup" exact={true}>
            <Signup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
