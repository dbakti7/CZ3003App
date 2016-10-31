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
    return (<li>
    <Link to = {`/user/${Meteor.userId()}/0`} activeClassName="active">{Meteor.userId()}</Link><br/>
    <br/>
    <Link to =  "/report/0/1" activeClassName="active"><button>Submit Report</button></Link>
    </li>);
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);