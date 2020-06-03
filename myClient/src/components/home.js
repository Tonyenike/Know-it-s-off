import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {CircleSpinner} from 'react-spinners-kit';
import GridApp from './grid/GridApp';
import GridContext from './grid/GridContext';

export default class Home extends Component {
   static contextType = GridContext
   constructor(props) {
      super(props);
      this.state = {
         myAppliances: [],
         myScouts: [],
         loading: true,
         error: false,
         redirect: null
      };
   };

countAppliancesOn = (arr) => {
   var result = 0;
   for(var x = 0; arr.length > x; x++){
      if(arr[x].status === true){
         result++;
      }
   }
   return result;
}

componentDidMount() {
   axios.get("/appliances")
      .then( (app_result) => {
         this.setState({
            myAppliances: app_result.data,
            appliancesOn: this.countAppliancesOn(app_result.data)
         })
      axios.get("/scouts")
         .then( (sco_result) => {
            this.setState({ myScouts: sco_result.data })
            this.addAppliancetoScout(sco_result.data, app_result.data);
            //This passes the list of scouts to the context once.
            const context = this.context
            context.setItems(sco_result.data)
            this.setState({loading: false})
         })
         .catch( (error) => {
            this.setState({loading: false, error: true});
            console.log("error at get scouts: ", error.response)
         })
      })
      .catch( (error) => {
         //most likely cause of error here is failed authentication, so redirect
         this.setState({loading: false, error: true});
         if(error.response.data === "not authorized"){this.setState({redirect:"/login"})}
         console.log("error at get appliances: ", error.response)
      })
}

addAppliancetoScout(scouts, appliances) {
   let i, j;
   for(i in scouts){
      for(j in appliances){
         if(appliances[j].id === scouts[i].appliance_id){
            const app = appliances[j]; //an appliance of a scout
            let a = scouts.slice(); //copy array
            //let newState = Object.assign({}, this.state);
            a[i].appliance_name = app.name;
            a[i].appliance_type = app.type;
            a[i].status = app.status;
            this.setState({myScouts: a}); //save appliance of scout i
         }
      }
   }
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
               {this.state.appliancesOn} of your appliances are on.
            </h6>
         </div>
      </div>
      {/*<div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 m-3">
      <Tile key={scout.id} scout_id={scout.id} scout_name={scout.name} scout_battery={scout.battery_power} appliance_name={scout.appliance_name} appliance_type={scout.appliance_type} appliance_status={scout.appliance_status}/>
      </div>*/}
{/*      <GridContextProvider onChange={this.onChange}>
         <div className="container">
            <GridDropZone id="myScouts" boxesPerRow={4} rowHeight={100}>
               {this.state.myScouts.map(scout => (
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
