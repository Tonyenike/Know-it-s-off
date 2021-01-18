import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import {Link} from 'react-router-dom';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {buildStyles} from 'react-circular-progressbar';
import {CircleSpinner} from 'react-spinners-kit';
import axiosBaseURL from '../axios.js';

export default class Tile extends Component {
   state={
      device_id: this.props.device_id,
      device_battery: this.props.device_battery,
      appliance_name: this.props.appliance_name,
      device_state: this.props.state,
      timestamp: this.props.timestamp, 
      statusText: "OFF",
      background: "light",
      loading: true
   }

   componentDidMount() {
      if(this.props.state){
         this.setState({
            background: "success",
            statusText: "ON"
         })
      }
      else if(!this.props.state){
         this.setState({background: "danger"})
      }
      this.setState({loading: false})
   }
   deleteScout = (event) => {
      //need to confirm first
      const r = window.confirm("Do you really want to delete this, it will be permanent!");
      if(r === true){
         axiosBaseURL.delete("/device/"+this.state.device_id)
         .then((result) => {this.setState({redirect:"/"})})
         .catch((error) => {this.setState({ error: true });})
      }
   };

   render(){
      if(this.state.loading) {
         return (
            <div className="d-flex justify-content-center m-5">
               <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
            </div>)
      }
      return(
         <Card bg={this.state.background} className="tile text-center col">
            <Card.Header>
               <CircularProgressbar value={this.state.device_battery} maxValue={1} text={`${this.state.device_battery}%`} styles={buildStyles({textSize: '2.2rem',textColor:'#000'})}/>
               <Card.Title className="card-title-device">{this.state.appliance_name}</Card.Title>
            </Card.Header>
            <Card.Body>
               <Card.Title className="card-title-status">{this.state.statusText}</Card.Title>
               {/*<Card.Text className="card-text-type">{this.state.appliance_name}</Card.Text>*/}
               <Card.Text className="card-text-device_state">{this.state.state}</Card.Text>
               <Card.Text classname="card-text-timestamp">Last Seen: {this.state.timestamp}</Card.Text>
               <Link className="card-button btn btn-primary text-wrap" to={"/device/"+this.state.device_id}>Edit Device</Link>
               {/*I was thinking about using a dropdown here instead so that you can delete a scout without having
               to go to the edit scout page, which may not load if the appliance of the scout doesnt exist
               <DropdownButton device_id="dropdown-button" title="Dropdown button">
                  <Dropdown.Item href={"/scout/"+this.state.device_id}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={this.deleteScout}>Delete</Dropdown.Item>
               </DropdownButton>*/}
            </Card.Body>
         </Card>
      )
   }
}
