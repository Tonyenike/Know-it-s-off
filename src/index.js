import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DndProvider } from "react-dnd";
import { GridProvider } from "./components/grid/GridContext";
import { TouchBackend } from'react-dnd-touch-backend';

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