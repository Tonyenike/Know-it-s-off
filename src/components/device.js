import React, {Component} from 'react'
import {Link} from 'react-router-dom';

export default class Devices extends Component {
	state={
		appliance_name: this.props.appliance_name,
		state: this.props.state,
		id: this.props.id
	}
	render(){
		return(
			<div className="col mt-3">
			<div className="card bg-light">
  				<div className="card-body">
    					<h5 className="card-title text-wrap">{this.state.appliance_name}</h5>
    					<p className="card-text">State:{this.state.device_state}</p>
    					<p className="card-text">Battery:{this.state.device_battery}</p>
    					<Link to={"/device/" + this.state.id} className="btn btn-primary text-wrap">Modify device details</Link>
  				</div>
			</div>
			</div>
		)
	}
}

