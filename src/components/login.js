import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import {Link} from 'react-router-dom';
import axiosBaseURL from '../axios.js'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    loading: false,
	    email: "",
	    password: "",
      error: false,
      flag: false, 
	    postLoading: false, 
      remember: true
    };
  }
  

  doLogin = (event) => {
	  this.setState({postLoading:true});
	  axiosBaseURL.post('/login', {email: this.state.email, password: this.state.password, remember: this.state.remember})
	  .then(
		  (result) =>{this.setState({postLoading: false, flag:false}); 
      this.props.history.push("/home"); 
    })
    .catch((error)=>{this.setState({postLoading:false, flag:true});
    })
	  event.preventDefault();
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
   //trys to check if authenticated already and redirect
   //when logging out its a little slow so it authenticates and redirects too quickly

  toggleCheckbox = () => {
    this.setState(({ remember }) => (
      {
        remember: !remember
      }
    ));
  }

	render(){
		if(this.state.error){
			return(<div classNameName="m-5"><h3>There was an error</h3></div>)
		}
		if(this.state.loading){
      			return (<div classNameName="d-flex justify-content-center m-5"><CircleSpinner size={60} color="#686769" loading={this.state.loading} /></div>)
    }
    const {flag} = this.state;
    // <a href={{ url_for('oauth_authorize', provider='google') }}><img src="{{ url_for('static', filename='img/sign-in-with-google.png') }}" /></a>
		return(
<div className="mt-5 mb-5 container bg-dark border">
<div className="row justify-content-md-center text-light mt-5">
<h1>Log In to Know It's Off</h1>
</div>
<div className="row justify-content-md-center text-light mb-5">
<form>
  <div className="form-group">
    {flag && (
      <div color="red">Email or password incorrect</div>
    )}
    <label>Email address</label>
    <input name="email" type="email" className="form-control" value={this.state.email} onChange={this.handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
  </div>
  <div className="form-group">
    <label>Password</label>
    <input name="password" type="password" onChange={this.handleChange} value={this.state.password} className="form-control" id="exampleInputPassword1" placeholder="Password" />
  </div>
  <div className="form-check">
    <input className="form-check-input" type="checkbox" checked={this.state.remember} onChange={this.toggleCheckbox} id="checkbox"/>
    <label className="form-check-label" for="checkbox">Remember Me</label>
  </div>
  <button onClick={this.doLogin} className="btn btn-primary">Submit<CircleSpinner size={20} color="#3BBCE5" loading={this.state.postLoading} /></button>
  <Link id="signupHelp" to="/signup" className="form-text text-muted">Register New User</Link>
</form>
</div>
</div>
		)
	}
	

}

