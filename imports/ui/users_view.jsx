import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class Users_View extends TrackerReact(React.Component) {
  constructor() {
      super();
    }


  renderReports() {
    return this.props.user_list.map((user) => (
      <UserInstance key={user._id} report={reports} />
    ));
  }

//   {this.state.ready ? this.renderReports() : null}
  render() {
    
    return (<div>
          <ul>
          {this.renderReports()}
          </ul> 
          </div>)
          
  }
}

Users_View.propTypes = {
  users: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {

    const user_list = Meteor.users.find({}).fetch();
  
  return {
    user_list,
  };
}, Users_View);