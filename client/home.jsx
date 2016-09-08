import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
class Home extends Component {
  render() {
    return <div>Home page goes here</div>
  }
}

export default createContainer(() => {
  return {
    
  };
}, Home);