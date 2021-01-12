import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axiosBaseURL from '../axios.js'


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
	loading: false,
	email: "",
	password: "",
	error: false,
	postLoading: false
    };
  }
     doSignup = (event) => {
	     this.setState({postLoading:true});
	axiosBaseURL.post('/users', {email: this.state.email, password: this.state.password})
	     .then(
		     (result) =>{this.setState({postLoading: false}); 
             this.props.history.push("/login"); })
        .catch((error)=>{this.setState({postLoading:false});
             alert("Invalid username and password");
             console.log(error);})
	event.preventDefault();
     };
handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

	render(){
		if(this.state.error){
			return(<div classNameName="m-5"><h3>There was an error</h3></div>)
		}
		if(this.state.loading){
      			return (<div classNameName="d-flex justify-content-center m-5"><CircleSpinner size={60} color="#686769" loading={this.state.loading} /></div>)
		}
		return(
<div className="mt-5 mb-5 container bg-light border">
<div className="row justify-content-md-center mt-5">
<h1>Sign up to Know It's Off</h1>
</div>
<div className="row justify-content-md-center mb-5">
<form>
  <div className="form-group">
    <label>Email address</label>
    <input name="email" type="email" className="form-control" value={this.state.email} onChange={this.handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group">
    <label>Password</label>
    <input name="password" type="password" onChange={this.handleChange} value={this.state.password} className="form-control" id="exampleInputPassword1" placeholder="Password" />
  </div>
  <div className="form-group">
    <label>Confirm Password</label>
    <input name="passwordConf" type="password" onChange={this.handleChange} value={this.state.passwordConf} className="form-control" id="exampleInputPassword2" placeholder="Password" />
  </div>
  <button onClick={this.doSignup} className="btn btn-primary">Submit<CircleSpinner size={20} color="#3BBCE5" loading={this.state.postLoading} /></button>
</form>
</div>
</div>
		)
	}
	

}

