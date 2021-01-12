import React, {Component} from 'react';
import axiosBaseURL from '../axios.js'
;
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
      if(arr[x].state === true){
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
            dev_state: this.count_dev_state(app_result.data)
         })
      })
      .catch( (error) => {
         //most likely cause of error here is failed authentication, so redirect
         this.setState({loading: false, error: true});
         //if(error.response.data === "not authorized"){this.setState({redirect:"/login"})}
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
      console.log(this.state)
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
               {this.state.dev_state} of your appliances are on.
            </h6>
         </div>
      </div>
      {/*<div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 m-3">
      <Tile key={scout.id} scout_id={scout.id} scout_name={scout.name} scout_battery={scout.battery_power} appliance_name={scout.appliance_name} appliance_type={scout.appliance_type} appliance_status={scout.appliance_status}/>
      </div>*/}
{/*      <GridContextProvider onChange={this.onChange}>
         <div className="container">
            <GridDropZone id="myDevices" boxesPerRow={4} rowHeight={100}>
               {this.state.myDevices.map(scout => (
                  <GridItem key={scout.id}>
                     <div className="grid-item">
                        <div className="grid-item-content" style={{width:"100%",height:"100%"}}>
                           <Tile key={scout.id} scout_id={scout.id} scout_name={scout.name} scout_battery={scout.battery_power} appliance_name={scout.appliance_name} appliance_type={scout.appliance_type} appliance_status={scout.appliance_status}/>
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
