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
      const userAuxSubscription = Meteor.subscribe('userAux',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        });
      }.bind(this)});

      const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : userSubscription.ready() && userAuxSubscription.ready()
        });
      }.bind(this)});

      this.state = {
        ready : userSubscription.ready() && userAuxSubscription.ready()
      }
    }


  renderUsers() {
      const userList = Meteor.users.find({}).fetch()  
    return userList.map((user) => (
      <UserInstance key={user._id} user={user} />
    ));
  }

  editFormatter(cell, row){
    // console.log("HAHAHA",cell);
    return  <div>
              <Link to = {`/user/${cell}/0`} activeClassName="active"><button >Edit</button></Link>
              <button className="delete" onClick={function() {
                Meteor.call('userData.remove', cell);
              }} >Delete</button>
            </div>;
  }

  render() {
    // {this.state.ready ? this.renderUsers() : null}
    userData = Meteor.users.find({}).fetch();
    // console.log("ASS", userData);
    return (<div>
              <BootstrapTable data={userData} striped={true} hover={true} pagination={true} search={true}>
                <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="username" dataSort={true}>User Name</TableHeaderColumn>
                <TableHeaderColumn dataField="roles" dataSort={true}>Account Type</TableHeaderColumn>
                <TableHeaderColumn dataField="_id" dataFormat={this.editFormatter}>Action</TableHeaderColumn> 
              </BootstrapTable>
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