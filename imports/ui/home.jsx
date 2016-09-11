import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
class Home extends Component {
  render() {
    return (
      <div>
      <h2>Home Page</h2>
      <AccountsUIWrapper />
      </div>);
      
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);