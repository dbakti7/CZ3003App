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

class Dengue extends TrackerReact(React.Component) {

  render() {
      console.log("IN DENGUE");     
    return (<div width="100%" height="100%">
        <iframe width="100%" height="900px" src="https://data.gov.sg/dataset/dengue-clusters/resource/ce15cf3c-702c-4573-96db-69c50e6cb7f8/view/7bb2a106-0e86-4f18-873b-726bb5b6f922" frameBorder="0"> </iframe>
        </div>);
  }
};

export default createContainer(({params}) => {
  return {        
         
       };
}, Dengue);