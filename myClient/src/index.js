import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { DndProvider } from "react-dnd";
import { GridProvider } from "./components/grid/GridContext";
//import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from'react-dnd-touch-backend';

//React DnD warns this option may be buggy, needs more testing
const options = {enableMouseEvents: true}

ReactDOM.render(
   <DndProvider backend={TouchBackend} options={options}>
      <GridProvider>
         <App />
      </GridProvider>
   </DndProvider>,
   document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
