import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class User extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const userName = ReactDOM.findDOMNode(this.refs.textUserName).value.trim();
    const fullName = ReactDOM.findDOMNode(this.refs.textFullName).value.trim();
    
    Meteor.call('userData.update', Meteor.userId(), fullName);     
    alert("User data has been updated!");
    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  componentWillReceiveProps() {
    var users_data = UserData_db.find({originalUserId: Meteor.userId()}).fetch();

    ReactDOM.findDOMNode(this.refs.textUserName).value = Meteor.user().username;
    ReactDOM.findDOMNode(this.refs.textUserName).disabled = true;
    if(users_data.length > 0) { 
      ReactDOM.findDOMNode(this.refs.textFullName).value = users_data[0].fullName;
    }
    else {
      ReactDOM.findDOMNode(this.refs.textFullName).value = "";
    }
    //Meteor.users.findOne({ _id: Meteor.userId() }).username
  }

  
  render() {
    return (<div>User ID: {this.props.params.user_id} <br/> Edit (True/False): 
    {this.props.params.edit}
    <form name="userForm" onSubmit={this.handleSubmit.bind(this)} >
            UserName: <input type="text" ref="textUserName" placeholder="User Name"/><br/>
            FullName: <input type="text" ref="textFullName" placeholder="Full Name"/><br/>
            <input width="50%" type="submit" value="Update"/>
          </form>
    </div>);
  }
}

User.propTypes = {
  user_data: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  Meteor.subscribe('userData');
  return {
        //report_item,
        user_data: UserData_db.find({originalUserId: Meteor.userId()}).fetch(),
      };
}, User);