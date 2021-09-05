import Flag from './components/Flag/Flag';
import Todo from './components/Todo/Todo';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <nav className="app-nav">
          <Link to="/">Flag</Link>
          <Link to="/todo">Todo List</Link>

        </nav>
        <main>
          <Switch>
            <Route path="/todo">
              <Todo></Todo>
            </Route>
            <Route path="/">
              <Flag></Flag>
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
