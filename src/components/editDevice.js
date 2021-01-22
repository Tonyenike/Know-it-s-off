import React, {Component} from 'react';
import {CircleSpinner} from 'react-spinners-kit' ;
import axiosBaseURL from '../axios.js'

import {Redirect} from 'react-router-dom'

var dbString

export default class editDevice extends Component {
   constructor(props) {
     super(props);
     this.state = {
         myDevice: {
            appliance_name: "My Appliance",
            device_state: 1, 
            device_battery: 100.0,
            timestamp: "2019-04-30T08:59:00.000Z",
            id: 1,
         },
	   loading: true,
	   error: false,
      }
   };
   componentDidMount() {
      const handle = this.props.match.params.handle;
		dbString = "/device/" + handle
		axiosBaseURL.get(dbString)
		.then((result) => {
			this.setState({ 
				myDevice: {
					id: result.data.id, 
					appliance_name: result.data.appliance_name, 
					device_state: result.data.device_state, 
					device_battery: result.data.device_battery, 
					timestamp: result.data.timestamp
            },
            loading: false
			});
      })
      .catch( (error) => {
         this.setState({loading: false, error: true});
         if(error.response){
            this.setState({error_response: error.response.data});
            if(error.response.data === "not authorized"){ this.setState({redirect: dbString}) }
            else if (error.response.data){console.log(error.response)}
         }
      })
   }

   updateDevice = (event) => {
      this.setState({loading:true});
      axiosBaseURL.patch(dbString, this.state.myDevice)
      .then((result) => {
         this.setState({loading: false});
            alert("Device Updated Successfully!")
      })
      .catch((error)=>{
         this.setState({loading:false, error:true})
         if(error.response.data){console.log(error.response)}
      })
	   event.preventDefault();
   };
   deleteDevice = (event) => {
      const r = window.confirm("Do you really want to delete this, it will be permanent!");
      if(r === true){
         axiosBaseURL.delete("/device/"+this.state.id)
         .then((result) => {this.setState({redirect: dbString})})
         .catch((error) => {
            this.setState({ error: true });
            if(error.response){
               console.log(error.response)
               this.setState({error_response: error.response.data})
            }
         })
      }
   };
   handleChangeDevice = (event) => { 
      this.setState({
         myDevice : {...this.state.myDevice, [event.target.appliance_name]: event.target.value}
      });
   };

	render(){
		if(this.state.error) {
         if(this.state.redirect) {return <Redirect to={this.state.redirect} />}
         return(<div className="m-5"><h3>There was an error</h3></div>) 
      }
		if(this.state.loading){
         return (
            <div className="d-flex justify-content-center m-5">
               <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
            </div>)
		}
		return(
<div className="m-5">
<h3>Edit Device</h3>
<form>
   <div className="form-group">
      <label>Appliance Name</label>
      <input className="form-control" appliance_name="appliance_name" id="inputDeviceName" aria-describedby="nameHelp" onChange={this.handleChangeDevice} value={this.state.myDevice.appliance_name} />
   </div>

   <button onClick={this.updateDevice} className="btn btn-success">Update<CircleSpinner size={20} color="#3BBCE5" loading={this.state.loading} /></button>
   <button onClick={this.deleteDevice} className="btn btn-danger">Delete<CircleSpinner size={20} color="#3BBCE5" loading={this.state.loading} /></button>
</form>
</div>
		)
	}
}

