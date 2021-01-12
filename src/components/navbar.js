import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class MyNavbar extends Component {
/* Toggle taken from https://www.bennettnotes.com/bootstrap-navbar-collapse-reactjs/ */
   constructor(props){
      super(props);
      this.toggleNavbar = this.toggleNavbar.bind(this);
      this.state ={
         collapsed: true
      };
   }
   toggleNavbar() {
      this.setState({ collapsed: !this.state.collapsed });
   }

	render(){
      const collapsed = this.state.collapsed;
      const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse nav-bar collapse show';
      const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
		return(

<nav className="navbar navbar-expand-lg navbar-light bg-info">
  <Link to="/home" className="navbar-brand">Know It's Off</Link>
  <button onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className={`${classOne}`} id="navbarNavAltMarkup">
    <div className="navbar-nav">
      <Link to="/home" className="nav-item nav-link active">Home </Link>
      <Link to="/devices" className="nav-item nav-link">My Devices</Link>
      <Link to="/device/new" className="nav-item nav-link">New Device</Link>
      <Link to="/user/edit" className="nav-item nav-link">Edit User</Link>
      <Link to="/logout" className="nav-item nav-link">Logout</Link>
    </div>
  </div>
</nav>
		)
	}
}

