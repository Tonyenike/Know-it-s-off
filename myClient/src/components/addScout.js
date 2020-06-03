import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axios from 'axios'

export default class AddScout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myAppliance: {
		   name: "My Appliance",
		   type: "Oven",
         alert_message: "Appliance is left on",
         alert_time: 200,
		   alert_email: false,
		   alert_text: false
	   },
      myScout: {
         name: "My Scout",
         appliance_id: 0
      },
      usersAppliances: [],
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
      axios.get("/appliances")
      .then((result) => {
         this.setState({
            loading: false,
            usersAppliances: result.data
         });
         var myList = [];
         var i;
         for(i in this.state.usersAppliances) {
            myList.push([this.state.usersAppliances[i].name, this.state.usersAppliances[i].id])
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
      if(this.state.myScout.appliance_id === 0){
         axios.post('/appliances', this.state.myAppliance)
         .then((result) => {
            console.log(result)
            this.setState({ myScout: {...this.state.myScout, appliance_id: result.data.id} })
            this.postScout()
         })
         .catch((error) => {this.setState({postLoading:false, error:true})})
      }
      else {this.postScout()}
	   event.preventDefault();
   };
   postScout() {
      console.log(this.state)
      axios.post('/scouts', this.state.myScout)
      .then((result) =>{
         this.setState({postLoading: false}); 
			alert("Appliance added.")
      })
      .catch((error) => {this.setState({postLoading:false, error:true})})
   };

   handleChange = (event) => {
      this.setState({
         myAppliance : {...this.state.myAppliance, [event.target.name]: event.target.value}
      });
   };
   handleChangeScout = (event) => {
      this.setState({
         myScout : {...this.state.myScout, [event.target.name]: event.target.value}
      });
   };
   handleChangeSelect = (event) => {
      //get the appliance id of the choosen value and set in state
      if(event.target.value === "New Appliance"){ 
         this.setState({
            disabled: false, 
            myScout: {...this.state.myScout, appliance_id: 0}
         })
      }
      else{
         this.setState({
            disabled: true, 
            myScout: {...this.state.myScout, appliance_id: parseInt(event.target.value)}
         })
      }
   };
   handleChangeCheck = (event) => {
      if(event.target.value === "false"){
         this.setState({myAppliance: {...this.state.myAppliance, [event.target.name]: true}})
      }
      else {
         this.setState({myAppliance: {...this.state.myAppliance, [event.target.name]: false}})
      }
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
      let options = this.state.applianceNames.map((data) =>
         <option key={data[1]} value={data[1]}>{data[0]}</option>
      );
		return(
<div className="m-5">
<h3>New Scout</h3>
<form>
   <div className="form-group">
      <label>Scout name</label>
      <input className="form-control" name="name" id="inputScoutName" aria-describedby="nameHelp" onChange={this.handleChangeScout} value={this.state.myScout.name} />
   </div>

   <div className="form-group">
      <label>Choose Existing Appliance</label>
      <select className="form-control" id="inputApplianceId" onChange={this.handleChangeSelect}>
         <option>New Appliance</option>
         {options}
      </select>
   </div>

   <div className="form-group">
      <label>Appliance name</label>
      <input className="form-control" name="name" id="inputApplianceName" disabled={this.state.disabled} onChange={this.handleChange} value={this.state.myAppliance.name} />
   </div>

   <div className="form-group">
      <label>Appliance type</label>
      <input className="form-control" name="type" id="inputApplianceType" disabled={this.state.disabled} onChange={this.handleChange} value={this.state.myAppliance.type} />
   </div>

   <div className="form-group">
      <label>Alert Message</label>
      <input className="form-control" name="alert_message" id="inputAlertMessage" disabled={this.state.disabled} onChange={this.handleChange} value={this.state.myAppliance.alert_message} />
   </div>

   <div className="form-group">
      <label>Alert Time</label>
      <input className="form-control" name="alert_time" id="inputAlertTime" disabled={this.state.disabled} onChange={this.handleChange} value={this.state.myAppliance.alert_time} />
   </div>

   <div className="form-check">
      <input type="checkbox" className="form-check-input" name="alert_email" disabled={this.state.disabled} onChange={this.handleChangeCheck} value={this.state.myAppliance.alert_email} id="inputAlertEmail" />
      <label className="form-check-label">Send email alerts</label>
   </div>

   <div className="form-check">
      <input type="checkbox" className="form-check-input" id="inputAlertText" name="alert_text" disabled={this.state.disabled} onChange={this.handleChangeCheck} value={this.state.myAppliance.alert_text} />
      <label className="form-check-label">Send text alerts</label>
   </div>

   <button onClick={this.postData} className="btn btn-success">Add this scout<CircleSpinner size={20} color="#3BBCE5" loading={this.state.postLoading} /></button>
</form>
</div>
		)
	}
}

