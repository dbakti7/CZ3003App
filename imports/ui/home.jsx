import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
class Home extends Component {
  render() {
    return (
      <h2>Home Page</h2>)
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);