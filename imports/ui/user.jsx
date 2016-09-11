import React, { Component, PropTypes, componentDidMount} from 'react';
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

    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  componentDidMount() {
    while((Session.get('postsReady')) == false);
    console.log("DID MOUNT");
    console.log(Meteor.userId())
    var users_data = this.props.user_data;

    // console.log(users_data.length)
    ReactDOM.findDOMNode(this.refs.textUserName).value = Meteor.user().username;
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
            <input width="50%" type="submit" value="Report"/>
          </form>
    </div>);
  }
}

User.propTypes = {
  user_data: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  Meteor.subscribe('userData', function() {
    console.log(UserData_db.find({originalUserId: Meteor.userId()}).fetch().length)
    Session.set('postsReady', true);
      
  });
  while((Session.get('postsReady')) == false);
  return {
        //report_item,
        user_data: UserData_db.find({originalUserId: Meteor.userId()}).fetch(),
      };
}, User);