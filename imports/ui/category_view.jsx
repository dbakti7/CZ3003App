import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import IncidentType from './incidentType.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class Category extends TrackerReact(React.Component) {

  constructor() {
    super();
    const subscription = Meteor.subscribe('incidentType', {onReady: function() {
      this.setState({
        ready: userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
      })
    }.bind(this)});

    const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
        });
      }.bind(this)});

      const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
        })
      }.bind(this)})

    this.state = {
      userID : Meteor.userId(),
      ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready(),
      subscription: subscription
    }
  }

  renderIncidentTypes() {
    if(this.state.ready && !!this.state.userID) {
      return this.props.incidentType_data.map((incidentType_data) => (
        <IncidentType key={incidentType_data._id} incidentType={incidentType_data} userID={this.state.userID}/>
      ));
    }
  }

  componentWillUnmount() {
    this.state.subscription.stop();
  }

  render() {     
    return (<div>
      {this.state.ready ? this.renderIncidentTypes() : null}          
    </div>);
  }
};


export default createContainer(({params}) => {
  const incidentType_data = IncidentType_db.find({}).fetch();
  const category_id = params.incidentType_id;
  return {        
         incidentType_data,
         category_id,
       };
}, Category);