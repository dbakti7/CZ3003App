import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import UserInstance from './user_instance.jsx';

class Users_View extends TrackerReact(React.Component) {
  constructor() {
      super();
      const userSubscription = Meteor.subscribe('userAux',{onReady: function() {
        this.setState({
          ready : userSubscription.ready()
        });
      }.bind(this)});
      this.state = {
        ready: userSubscription.ready(),
      }
    }


  renderUsers() {
      const userList = Meteor.users.find({}).fetch()  
    return userList.map((user) => (
      <UserInstance key={user._id} user={user} />
    ));
  }


  render() {
    
    return (<div>
          <ul>
          {this.state.ready ? this.renderUsers() : null}
          </ul> 
          </div>)
          
  }
}

Users_View.propTypes = {
  users: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  
  return {
  };
}, Users_View);