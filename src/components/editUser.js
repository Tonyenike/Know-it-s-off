import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axiosBaseURL from '../axios.js'

export default class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: {
                username: "", 
                email: "", 
                password: "",
            },
            currentPass: "", 
            confirmPass: "",
            detail_form: false, 
            flag: false,
            loading: true, 
            verifyLoad: false,
            deleteLoad: false, 
            changeLoad: false, 
            error: false, 
            redirect: null
        };
    }

   componentDidMount() {
      if(this.state.detail_form === false)
         axiosBaseURL.get("/user/current")
         .then((result) => {
            this.setState({
               loading: false, 
               current: {
                  username: result.data.username, 
                  email: result.data.email
               }
            });
         })
         .catch((error) => {
            this.setState({loading: false, error: true});
            if(error.response){
               this.setState({error_response: error.response.status});
               if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response.data)}
         }
      })
   }

   verify = (event) => {
      this.setState({verifyLoad : true});
      axiosBaseURL.post('/login', {email: this.state.current.email, password: this.state.current.password})
      .then((result) => {
         this.setState({verifyLoad: false, detail_form: true, flag: false});
      })
      .catch((error) => {
         this.setState({verifyLoad: false, flag:true, error_response: error.response.status});
         if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
         else if (error.response.data){console.log(error.response.data)}
      })
      event.preventDefault();
   }

   delete = (event) => {
        this.setState({deleteLoad : true});
        const r = window.confirm("Are you sure?");
        if(r === true) {
            axiosBaseURL.post('/login', {email: this.state.current.email, password: this.state.current.password})
            .then((result) => {
                axiosBaseURL.delete('/user/current')
                this.setState({deleteLoad: false, redirect: "/"})
            })
            .catch((error) => {
                this.setState({deleteLoad: false, flag:true, error_response: error.response.status});
                if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
                else if (error.response.data){console.log(error.response.data)}
            })
        }
        else this.setState({loading : false})
   }

   handleChange = (event) => {
        this.setState({
           current: {...this.state.current,[event.target.name]: event.target.value}
        });
   };

   handlePassChange = (event) => {
      this.setState({[event.target.name]: event.target.value})
   };


   update = (event) => {
      this.setState({changeLoad: true})
      if(this.state.current.email === undefined || this.state.current.username === undefined) {
         alert("Fill out Username field.");
         this.setState({changeLoad: false});
         event.preventDefault();
      }
      else if(this.state.confirmPass !== this.state.currentPass) {
         alert("Passwords do not match.");
         this.setState({changeLoad: false});
         event.preventDefault();
      }
      else {
         axiosBaseURL.post('/login', {email: this.state.current.email, password: this.state.current.password})
         .then((result) => {
            axiosBaseURL.patch('/user/current', {email: this.state.current.email, password: this.state.confirmPass, username: this.state.current.username})
            .then((result) => {
               this.setState({changeLoad: false})
               alert("User Information Successfully Updated!");
            })
            .catch((error) => {
               this.setState({changeLoad: false, error: true, error_response: error.response.data})
               if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
               else if (error.response.data){console.log(error.response.data)}
            });
         })
         .catch((error) => {
            this.setState({changeLoad: false, error: true, error_response: error.response.data})
            if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response.data)}
         });
         event.preventDefault();
      }
   };

   render() {
      if(this.state.error) {
         return(<div className="m-5"><h3>Error: Not Logged In</h3></div>)  
      }
      if(this.state.loading){
         return (
            <div className="d-flex justify-content-center m-5">
               <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
            </div>)
         }
      const {detail_form, flag} = this.state;
      return(
<div className="m-5">
{flag && (
    <div color="red">Email or password incorrect</div>
)}
<h3>Enter User Details:</h3>
<form>
    <div className="form-group">
        <label>Email</label>
        <input className="form-control" name="email" id="inputEmail" type="email" onChange={this.handleChange} value={this.state.current.email}></input>
    </div>

    <div className="form-group">
        <label>Password</label>
        <input className="form-control" name="password" id="inputPassword" type="password" onChange={this.handleChange} value={this.state.current.password}></input>
    </div>

    <button onClick={this.verify} className="btn btn-success">Verify and Change User Details<CircleSpinner size={10} color="#3BBCE5" loading={this.state.verifyLoad} /></button>
    <button onClick={this.delete} className="btn btn-danger">Delete User<CircleSpinner size={10} color="#3BBCE5" loading={this.state.deleteLoad} /></button>
</form>
{detail_form && (
    <form>
        <div className="form-group">
            <label>Change Username</label>
            <input className="form-control" name="username" id="inputUsername" type="username" onChange={this.handleChange} value={this.state.current.username} placeholder={this.state.current.username}/>
        </div>
        
        <div className="form-group">
            <label>Change Email</label>
            <input className="form-control" name="email" id="inputEmail" type="email" onChange={this.handleChange} value={this.state.current.email} placeholder={this.state.current.email}/>
        </div>

        <div className="form-group">
            <label>Change Password</label>
            <input className="form-control" name="currentPass" id="inputCurrentPass" type="password" onChange={this.handlePassChange} value={this.state.currentPass} placeholder={this.state.currentPass}/>
        </div>
        <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-control" name="confirmPass" id="inputConfirmPass" type="password" onChange={this.handlePassChange} value={this.state.confirmPass} placeholder={this.state.confirmPass}/>
            <button onClick={this.update} className="btn btn-success">Update Information<CircleSpinner size={10} color="#3BBCE5" loading={this.state.changeLoad} /></button>
        </div>
    </form>
    )}
</div>
        )
    }
}