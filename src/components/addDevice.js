import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axiosBaseURL from '../axios.js'
import Tile from "./tile.js";

export default class addDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myDevice: {
         id: "0",
		   appliance_name: "My Appliance",
         device_state: 0, 
         device_battery: 100.0,
	   },
      userDevices: [],
      applianceNames: [],
      disabled: false,
	   loading: true,
	   error: false,
	   postLoading: false,
      redirect: null, 
      revealDetails: false, 
    };
  }

   //Get users appliances, add the names to the select form element
   componentDidMount() {
      axiosBaseURL.get("/devices")
      .then((result) => {
         this.setState({
            loading: false,
            usersDevices: result.data
         });
         var myList = [];
         var i;
         for(i in this.state.usersDevices) {
            myList.push([this.state.usersDevices[i].appliance_name, this.state.usersDevices[i].id, this.state.usersDevices[i].device_battery, this.state.usersDevices[i].device_state])
         }
         this.setState({applianceNames: myList})
      })
      .catch( (error) => {
         this.setState({loading: false, error: true});
         if(error.response){
            this.setState({error_response: error.response.data});
            if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response.data)}
         }
      })
   }

   postData = (event) => {
      this.setState({postLoading:true});
      //if creating a new appliance post it first
      if(this.state.myDevice.id === "0"){
         axiosBaseURL.post('/device', this.state.myDevice)
         .then((result) => {
            this.setState({ myDevice: {...this.state.myDevice, id: result.data.id}, postLoading:false, revealDetails:true })
            alert("Device Creation Successful!");
            this.props.history.push('/home');
         })
         .catch((error) => {
            this.setState({postLoading:false, error:true, error_response: error.response.data})
            if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response.data)}
         })
         event.preventDefault();
      }
      else {alert("New Device Already Created!")}
   };

   handleChangeDevice = (event) => {
      this.setState({
         myDevice : {...this.state.myDevice, [event.target.name]: event.target.value}
      });
   };

	render(){
		if(this.state.error){ 
         return(<div className="m-5"><h3>There was an error</h3></div>) 
      }
		if(this.state.loading){
         return (
            <div className="d-flex justify-content-center m-5">
               <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
            </div>)
      }
      const {revealDetails} = this.state;
		return(
<div className="m-5 text-light">
<h3>New Device</h3>
<form>
   <div className="form-group">
      <label>Appliance Name</label>
      <input className="form-control" name="appliance_name" id="inputScoutName" aria-describedby="nameHelp" onChange={this.handleChangeDevice} value={this.state.myDevice.appliance_name} />
   </div>

   <button onClick={this.postData} className="btn btn-success">Add this device<CircleSpinner size={20} color="#3BBCE5" loading={this.state.postLoading} /></button>
</form>
{revealDetails && (
   <Tile key={this.state.myDevice.id} device_id={this.state.myDevice.id} device_battery={this.state.myDevice.device_battery} appliance_name={this.state.myDevice.appliance_name} state={this.state.myDevice.device_state} timestamp={this.state.myDevice.timestamp}></Tile>
)}
</div>
		)
	}
}

