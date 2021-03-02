import React, { Component, useState } from 'react';
import {Switch, Route, HashRouter as Router} from 'react-router-dom';
import './App.css';
import Logs from './components/logs';
import MyNavbar from './components/navbar';
import Default from './components/default';
import Login from './components/login';
import Signup from './components/signup';
import Logout from './components/logout'
import Home from './components/home';
import EditUser from './components/editUser';
import addDevice from './components/addDevice';
import editDevice from './components/editDevice';
import Device from './components/device';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "firebase";

// //Firebase push notifications
// const [isTokenFound, setTokenFound] = useState(false);
// getToken(setTokenFound);
// const messaging = firebase.messaging();


// export const getToken = (setTokenFound) => {
//   return messaging.getToken({vapidKey: 'GENERATED_MESSAGING_KEY'}).then((currentToken) => {
//     if (currentToken) {
//       console.log('current token for client: ', currentToken);
//       setTokenFound(true);
//       // Track the token -> client mapping, by sending to backend server
//       // show on the UI that permission is secured
//     } else {
//       console.log('No registration token available. Request permission to generate one.');
//       setTokenFound(false);
//       // shows on the UI that permission is required 
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // catch error while creating client token
//   });
// }


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
            <NavRoute exact path="/device/new" component={addDevice} />
            <NavRoute exact path="/device/:handle" component={Device} />
            <NavRoute exact path="/device/:handle/logs" component={Logs} />
            <NavRoute exact path="/device/:handle/edit" component={editDevice} />
            <NavRoute exact path="/user/edit" component={EditUser} />
            <NavRoute component={Default} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}


export default App;