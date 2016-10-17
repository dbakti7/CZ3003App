import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import {Link} from 'react-router'
class Home extends Component {
  render() {
    return (
      <div>
      <h2>Home Page</h2>
      <AccountsUIWrapper />
      {this.renderUser()}
      </div>);
      
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