import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axiosBaseURL from '../axios.js'


export default class addDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myDevice: {
         id: "400",
		   appliance_name: "My Appliance",
         device_state: "1", 
         device_battery: "100.0",
         timestamp: "2019-04-30T08:59:00.000Z",
	   },
      userDevices: [],
      applianceNames: [],
      disabled: false,
	   loading: true,
	   error: false,
	   postLoading: false,
      redirect: null
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
            myList.push([this.state.usersDevices[i].appliance_name, this.state.usersDevices[i].id, this.state.usersDevices[i].device_battery, this.state.usersDevices[i].timestamp, this.state.usersDevices[i].device_state])
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
      if(this.state.myDevice.device_id === 0){
         axiosBaseURL.post('/devices', this.state.myDevice)
         .then((result) => {
            console.log(result)
            this.setState({ myDevice: {...this.state.myDevice, device_id: result.data.id} })
         })
         .catch((error) => {this.setState({postLoading:false, error:true})})
      }
	   event.preventDefault();
   };

   handleChangeDevice = (event) => {
      this.setState({
         myDevice : {...this.state.myDevice, [event.target.appliance_name]: event.target.value}
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
		return(
<div className="m-5">
<h3>New Device</h3>
<form>
   <div className="form-group">
      <label>Appliance Name</label>
      <input className="form-control" appliance_name="appliance_name" id="inputScoutName" aria-describedby="nameHelp" onChange={this.handleChangeDevice} value={this.state.myDevice.appliance_name} />
   </div>

   <button onClick={this.postData} className="btn btn-success">Add this device<CircleSpinner size={20} color="#3BBCE5" loading={this.state.postLoading} /></button>
</form>
</div>
		)
	}
}

