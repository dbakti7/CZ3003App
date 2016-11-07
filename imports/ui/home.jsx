import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import {Link} from 'react-router'
import {IncidentType_db} from '../api/incidentType.js';
import {UserData_db} from '../api/userData.js';
class Home extends Component {
constructor() {
      super();
      const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        });
      }.bind(this)});
      const subscription = Meteor.subscribe('incidentType');

      const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        })
      }.bind(this)})

      
      this.state = {
        ready : userSubscription.ready() && userAuxSubscription.ready()
        
      }
       
    }

  render() {
    return (
      <div>
      <h2>Home Page</h2>
      <AccountsUIWrapper />
      {this.renderUser()}
      {this.state.ready ? this.checkUser() : null}
      </div>);
      
  }
  checkUser() {
    console.log("INSIDE HERE AGAIN")
    console.log(Meteor.userId())
    console.log("INSIDE HERE AGAIN")
  }
  renderUser() {
    return (
      <div>
    <Link to =  "/report/0/1" activeClassName="active"><button>Submit Report</button></Link>
    <Link to =  "https://www.facebook.com/profile.php?id=100013904162136&fref=ts" target="_blank" activeClassName="active"><button>Facebook Subscription</button></Link>
    <Link to =  "https://twitter.com/cmssingapore" target="_blank" activeClassName="active"><button>Twitter Subscription</button></Link>
    </div>
    );
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);