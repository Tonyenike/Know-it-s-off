import React, {Component} from 'react';
import { Redirect} from 'react-router-dom';
import {CircleSpinner} from 'react-spinners-kit';
import axiosBaseURL from '../axios.js';
import CsvDownload from 'react-json-to-csv';

export default class batteryLogs extends Component {
	constructor(props) {
		super(props);
		this.state = {	
			battery: [
                {device_battery: 100.0, timestamp_time: ""}
            ],
		error: false,
		loading: true
		}
	};
	componentDidMount() {
		const handle = this.props.match.params.handle;
		var dbString = "/batteryLogs/" + handle
		axiosBaseURL.get(dbString)
		.then((result) => {
			this.setState({ 
				battery: result.data
			});
            console.log(result)
            console.log(this.state)
			this.setState({loading: false})
		})
	};
	render() {
		if(this.state.loading) {
			return (
			  <div className="d-flex justify-content-center m-5">
				 <CircleSpinner size={60} color="#686769" loading={this.state.loading} />
			  </div>)
		}
		if(this.state.error) {
			if(this.state.redirect) {return <Redirect to={this.state.redirect} />}
			return(<div><h3>There was an error</h3><h3>{this.state.error_response}</h3></div>)
		 }
		return(
			<React.Fragment>
				{this.state.battery.map((battery) => (
					<div className="col mt-3 text-light">
					<div className="card bg-dark">
						<div className="card-body">
								<p className="card-text">Battery: {battery.device_battery}%</p>
								<p className="card-text">Last Seen: {battery.timestamp_time}</p>
						</div>
					</div>
					</div>
				))}
				<CsvDownload style={{display: "flex", margin: "1em"}} className="btn btn-info float-right footer affix" data={this.state.battery}>Download CSV</CsvDownload>
			</React.Fragment>
		)
	}
}
