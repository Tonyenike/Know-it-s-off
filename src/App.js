import React, {Component} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import MyNavbar from './components/navbar';
import Default from './components/default';
import Login from './components/login';
import Signup from './components/signup';
import Logout from './components/logout'
import Home from './components/home';
import EditUser from './components/editUser';
//import "bootstrap/dist/css/bootstrap.min.css";
import addDevice from './components/addDevice';
import editDevice from './components/editDevice';
import Devices from './components/device';

const NavRoute = ({exact, path, component: Component}) => (
  <Route exact={exact} path={path} render={(props) => (
    <div>
      <MyNavbar />
      <Component {...props}/>
    </div>
  )}/>
)
class App extends Component {
  render() {
      return (
  <React.Fragment>
    <Router>
      <Switch>
       <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/signup" component={Signup} />
        <NavRoute exact path="/home" component={Home} />
        <NavRoute exact path="/devices" component={Devices} />
        <NavRoute exact path="/devices/new" component={addDevice} />
        <NavRoute exact path="/devices/:handle" component={editDevice} />
        <NavRoute exact path="/user/edit" component={EditUser} />
       <NavRoute component={Default} />
      </Switch>
    </Router>
  </React.Fragment>
      );
  }
}

export default App;