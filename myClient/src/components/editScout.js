import React, {Component} from 'react'
import {CircleSpinner} from 'react-spinners-kit' 
import axios from 'axios'
import {Redirect} from 'react-router-dom'

export default class EditScout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myAppliance: {},
      myScout: {},
      scout_id: null,
      newAppliance: {
         name: "My Appliance",
         type: "Oven",
         alert_message: "Appliance is left on",
         alert_time: 420,
         alert_text: false,
         alert_email: false
      },
      usersAppliances: [],
      applianceNames: [],
      doingNewAppliance: false,
      disabled: true,
	   loading: true,
	   error: false,
	   patchLoading: false,
      deleteLoading: false,
      redirect: null
    };
  }

   //Get users appliances, add the names to the select form element
   componentDidMount() {
      const handle = this.props.match.params.handle;
      this.setState({scout_id: handle})
      axios.get("/appliances")
      .then((result) => {
         this.setState({ usersAppliances: result.data });
         //build a list called applianceNames used to create the options for the <select>
         var myList = [];
         var i;
         for(i in this.state.usersAppliances) {
            myList.push([this.state.usersAppliances[i].name, this.state.usersAppliances[i].id, parseInt(i)+1])
         }
         this.setState({ applianceNames: myList })
      })
      .catch( (error) => {
         this.setState({loading: false, error: true});
         if(error.response){
            this.setState({error_response: error.response.data});
            if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response)}
         }
      })
      //get the details of the scout
      axios.get(`/scouts/${handle}`)
      .then((result) => {
         this.setState({ myScout: {name: result.data.name, appliance_id: result.data.appliance_id} });
         //get the details of the appliance that we are editing
         axios.get("/appliances/"+result.data.appliance_id)
         .then((result) => {
            this.setState({ myAppliance: result.data, loading: false})
         })
         .catch((error) => {
            //Probably authorized, an error here means the appliance doesnt exist or is inaccessible
            this.setState({loading: false,myAppliance:{...this.state.newAppliance,id:0}});
         })
      })
      .catch((error) => {
         this.setState({loading: false, error: true});
         if(error.response){
            this.setState({error_response: error.response.data});
            if(error.response.data === "not authorized"){ this.setState({redirect: "/"}) }
            else if (error.response.data){console.log(error.response)}
         }
      })
   }

   updateAppliance = (event) => {
      this.setState({patchLoading:true});
      if(this.state.myAppliance.id === 0) {
         //post new appliance and return id to patch scout
         axios.post('/appliances', this.state.myAppliance)
         .then((result) => {
            this.setState({myScout: {...this.state.myScout, appliance_id: result.data.id}})
            this.updateScout()
         })
         .catch((error)=>{
            this.setState({patchLoading:false,error:true})
            if(error.response.data){console.log(error.response)}
         })
      }
      else {
         axios.patch('/appliances/'+parseInt(this.state.myAppliance.id), this.state.myAppliance)
         .then((result) => {
            this.updateScout()
         })
         .catch((error)=>{
            this.setState({patchLoading:false,error:true})
            if(error.response.data){console.log(error.response)}
         })
      }
	   event.preventDefault();
   };
   updateScout() {
      axios.patch('/scouts/'+this.state.scout_id, this.state.myScout)
      .then((result) =>{
         this.setState({patchLoading: false}); 
			alert("Appliance updated.")
      })
      .catch((error)=>{
         this.setState({patchLoading:false,error:true})
         if(error.response.data){console.log(error.response)}
      })
   }
   deleteScout = (event) => {
      //need to confirm first
      const r = window.confirm("Do you really want to delete this, it will be permanent!");
      if(r === true){
         axios.delete("/scouts/"+this.state.scout_id)
         .then((result) => {this.setState({redirect:"/home"})})
         .catch((error) => {
            this.setState({ error: true });
            if(error.response){
               console.log(error.response)
               this.setState({error_response: error.response.data})
            }
         })
      }
   };

   handleChange = (event) => {
      //REMEMBER setState is async, cant expect myAppliance to be updated before new appliance
      this.setState({
         myAppliance : {...this.state.myAppliance, [event.target.name]: event.target.value}
      })
      if(this.state.doingNewAppliance){this.setState({newAppliance: {...this.state.myAppliance}})}
   };
   handleChangeScout = (event) => { 
      this.setState({
         myScout : {...this.state.myScout, [event.target.name]: event.target.value}
      });
   };
   handleChangeSelect = (event) => {
      //get the appliance id of the choosen value and set in state
      //dont want to disable any fields but does need to update the fields with appliance values
      if(event.target.value === "0"){ 
         this.setState({
            myAppliance: {...this.state.newAppliance, id: 0}, 
            myScout: {...this.state.myScout, appliance_id: 0},
            doingNewAppliance: true
         })
      }
      else{
         this.setState({
            myAppliance: {...this.state.usersAppliances[parseInt(event.target.value)-1]},
            myScout: {...this.state.myScout, appliance_id: this.state.usersAppliances[parseInt(event.target.value)-1].id},
            doingNewAppliance: false
         })
      }
   };
   handleChangeCheck = (event) => {
      this.setState({myAppliance:{...this.state.myAppliance,[event.target.name]:event.target.checked}})
      if(this.state.doingNewAppliance){this.setState({newAppliance: {...this.state.myAppliance,[event.target.name]:event.target.checked}})}
   };

	render(){
      if(this.state.redirect) {return <Redirect to={this.state.redirect} />}
		if(this.state.error){
         return(<div className="m-5"><h3>There was an error</h3></div>) 
      }
		if(this.state.loading){
         return (
            <div className="d-flex justify-content-center m-5">
               <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
            </div>)
		}
      //need to set the scouts appliance as "selected"
      //value has to match the index of usersAppliances, from that array you can fetch the id
      let options = this.state.applianceNames.map((data) =>
            {return <option key={data[2]} value={data[2]}>{data[0]}</option>}
         );
		return(
<div className="m-5">
<h3>Edit Scout</h3>
<form>
   <div className="form-group">
      <label>Scout name</label>
      <input className="form-control" name="name" id="inputScoutName" aria-describedby="nameHelp" onChange={this.handleChangeScout} value={this.state.myScout.name} />
   </div>

   <div className="form-group">
      <label>Choose Existing Appliance</label>
      <select className="form-control" id="inputApplianceId" onChange={this.handleChangeSelect} defaultValue={this.state.usersAppliances.findIndex(app => app.id === this.state.myAppliance.id)+1}>
         <option key="0" value="0">New Appliance</option>
         {options}
      </select>
   </div>

   <div className="form-group">
      <label>Appliance name</label>
      <input className="form-control" name="name" id="inputApplianceName" onChange={this.handleChange} value={this.state.myAppliance.name} />
   </div>

   <div className="form-group">
      <label>Appliance type</label>
      <input className="form-control" name="type" id="inputApplianceType" onChange={this.handleChange} value={this.state.myAppliance.type} />
   </div>

   <div className="form-group">
      <label>Alert Message</label>
      <input className="form-control" name="alert_message" id="inputAlertMessage" onChange={this.handleChange} value={this.state.myAppliance.alert_message} />
   </div>

   <div className="form-group">
      <label>Alert Time</label>
      <input className="form-control" name="alert_time" id="inputAlertTime" onChange={this.handleChange} value={this.state.myAppliance.alert_time} />
   </div>

   <div className="form-check">
      <input type="checkbox" className="form-check-input" name="alert_email" onChange={this.handleChangeCheck} checked={this.state.myAppliance.alert_email} id="inputAlertEmail" />
      <label className="form-check-label">Send email alerts</label>
   </div>

   <div className="form-check">
      <input type="checkbox" className="form-check-input" id="inputAlertText" name="alert_text" onChange={this.handleChangeCheck} checked={this.state.myAppliance.alert_text} />
      <label className="form-check-label">Send text alerts</label>
   </div>

   <button onClick={this.updateAppliance} className="btn btn-success">Update this scout<CircleSpinner size={20} color="#3BBCE5" loading={this.state.patchLoading} /></button>
   <button onClick={this.deleteScout} className="btn btn-danger">Delete this scout<CircleSpinner size={20} color="#3BBCE5" loading={this.state.deleteLoading} /></button>
</form>
</div>
		)
	}
}

