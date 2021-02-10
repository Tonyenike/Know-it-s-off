import React, {Component} from 'react'
import { Redirect } from 'react-router-dom';
import axiosBaseURL from '../axios.js'


export default class Logout extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: false,
         redirect: "/"
      };
   }
    
   render(){
        if(this.state.error){
            return(<div classNameName="m-5"><h3>There was an error</h3></div>)
        }
       // http call to /api/logout
      axiosBaseURL.get('/logout')
      .then(() => {
         //this.props.history.push('/login');
         
      })
      .catch(() => {
         return(   
            <Redirect to={this.state.invalid} />
         )
      })
      return(   
         <Redirect to={this.state.invalid} />
      )
    }
}