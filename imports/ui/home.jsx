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
      <br/>
      <br/>
      <AccountsUIWrapper />
      <br/>
      <br/><br/>
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
        <table className="homeTable" border="1">
          <tr>
            <td className="rest"><img src="/images/realTime.png" height="200" width="200" align="center"/></td>
            <td className="cellTable"><img src="/images/report.png" height="200" width="200" align="center"/></td> 
            <td className="rest"><img src="/images/24hr.png" height="200" width="200" align="center"/></td>
          </tr>
          <tr>
            <td className="rest"><h2><font color="#056571">Real-time Update</font></h2></td>
            <td className="cellTable"><h2><font color="#f2695d">Reliable Report</font></h2></td> 
            <td className="rest"><h2><font color="#f89c1b">24-hr Status</font></h2></td>
          </tr>
          <tr>
            <td className="rest">We provide real-time updates to all the reports and crisis reported. This helps you to get information quickly and precisely. </td>
            <td className="cellTable">All the crisis reported have been assessed thoroughly by our admin team. This allows us to provide accurately.</td> 
            <td className="rest">24 hour information. Crisis and accidents can happen any time. That is why we promise to give accurate information 24/7. </td>
          </tr>
        </table>
        <br/>
        <br/>
        <br/>

        <table width="100%">
          <tr width="100%">
            <td colspan="3" className="subscribeFBTwitter" align="center">
              <Link to =  "https://www.facebook.com/profile.php?id=100013904162136&fref=ts" target="_blank" activeClassName="active"><img className="subscribeButton"/></Link>
              &nbsp;&nbsp;
              <Link to =  "https://twitter.com/cmssingapore" target="_blank" activeClassName="active"><img className="followButton"/></Link>
            </td>
 
          </tr>
        </table>
        
        </div>
    );
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);