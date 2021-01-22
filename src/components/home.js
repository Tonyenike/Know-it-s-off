import React, {Component} from 'react';
import axiosBaseURL from '../axios.js';
import {Redirect} from 'react-router-dom';
import {CircleSpinner} from 'react-spinners-kit';
import GridApp from './grid/GridApp';
import GridContext from './grid/GridContext';

export default class Home extends Component {
   static contextType = GridContext
   constructor(props) {
      super(props);
      this.state = {
         myDevices: [],
         loading: true,
         error: false,
         redirect: null
      };
   };

count_dev_state = (arr) => {
   var result = 0;
   for(var x = 0; arr.length > x; x++){
      if(arr[x].device_state === 1){
         result++;
      }
   }
   return result;
}

componentDidMount() {
   axiosBaseURL.get("/devices")
      .then( (app_result) => {
         this.setState({
            myDevices: app_result.data,
            num_on: this.count_dev_state(app_result.data)
         })
         const context = this.context
         context.setItems(app_result.data)
         this.setState({loading: false})
      })
      .catch( (error) => {
         this.setState({loading: false, error: true});
         console.log("error at get device: ", error.response)
      })
}

render(){
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
   <div>
      <div className="row m-3">
         <div className="col">
            <h1 className="text-center">Home</h1>
         </div>
      </div>
      <div className="row m-3">
         <div className="col">
            <h6 className="text-muted text-center">
               {this.state.num_on} of your appliances are on.
            </h6>
         </div>
      </div>
      {/*<div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 m-3">
      <Tile key={this.state.myDevices.id} appliance_name={this.state.myDevices.appliance_name} device_battery={this.state.myDevices.battery_power} device_state={this.state.myDevices.device_state}/>
   </div>*/}
{/*      <GridContextProvider onChange={this.onChange}>
         <div className="container">
            <GridDropZone id="this.state.myDevices" boxesPerRow={4} rowHeight={100}>
               {this.state.this.state.myDevices.map(device => (
                  <GridItem key={device.id}>
                     <div className="grid-item">
                        <div className="grid-item-content" style={{width:"100%",height:"100%"}}>
                           <Tile key={device.id} appliance_name={device.appliance_name} device_battery={device.battery_power} device_state={device.device_state}/>
                        </div>
                     </div>
                  </GridItem>
               ))}
            </GridDropZone>
         </div>
      </GridContextProvider>*/}
      <GridApp/>      
   </div>
   )
}}
