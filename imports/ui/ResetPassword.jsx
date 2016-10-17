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

class ResetPassword extends TrackerReact(React.Component) {
    constructor() {
      super();
      
      const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        });
      }.bind(this)});


      const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        })
      }.bind(this)})

      
      this.state = {
        ready : userSubscription.ready() && userAuxSubscription.ready(),
      }
    }
  

  handleSubmit(event) {
    event.preventDefault();
 
    const password = ReactDOM.findDOMNode(this.refs.textPassword).value.trim();
    if(this.state.ready) {
        Meteor.call('userAux.setPassword', this.props.userID, password)
      }
    alert("Your Password has been reset!");
  }

  

  render() {     
    return (<div>
    <form name="incidentTypeForm" onSubmit={this.handleSubmit.bind(this)} >
            New Password: <input type="text" ref="textPassword" placeholder="Name"/><br/>
            <input width="50%" type="submit" value="Update"/>
          </form>
    </div>);
  }
};

export default createContainer(({params}) => {
  const userID = params.user_id 
  return {        
         userID,
       };
}, ResetPassword);