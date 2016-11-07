import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import IncidentType from './incidentType.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IndexLink, Link } from 'react-router'
import { Accounts } from 'meteor/accounts-base'

class Haze extends TrackerReact(React.Component) {

  render() {
      console.log("IN HAZE");     
    return (<div width="100%" height="100%">
        <iframe width="100%" height="900px" src="https://data.gov.sg/dataset/psi/resource/82776919-0de1-4faf-bd9e-9c997f9a729d/view/d57fb838-2ccc-4d5c-9adc-907b34185e5c" frameBorder="0"> </iframe>
        </div>);
  }
};

export default createContainer(({params}) => {
  return {        
         
       };
}, Haze);