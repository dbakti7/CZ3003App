import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class User extends Component {
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
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const userName = ReactDOM.findDOMNode(this.refs.textUserName).value.trim();
    const fullName = ReactDOM.findDOMNode(this.refs.textFullName).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.textEmail).value.trim();
    const type = ReactDOM.findDOMNode(this.refs.textType).value;
    const agencyName = ReactDOM.findDOMNode(this.refs.AgencyName).value.trim();

    if(type == "Admin" || type == "Operator")
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = true;
    else
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
      
    Meteor.call('setRole', Meteor.userId(), type);
    // console.log(Roles.userIsInRole( Meteor.userId(), 'Admin' ))
    // console.log(Roles.userIsInRole( Meteor.userId(), 'Operator' ))
    // console.log(Roles.userIsInRole( Meteor.userId(), 'Agency' ))
    
    Meteor.call('userData.update', Meteor.userId(), fullName, email, type, agencyName);     
    alert("User data has been updated!");
    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  postTweet(event) {
    event.preventDefault();

    Meteor.call("postTweet", this.refs.textTweet.value, function(err,result) {
    if(!err) {
      alert("Tweet posted");
    }
    });
  }

  componentWillReceiveProps() {
    var users_data = UserData_db.find({originalUserId: Meteor.userId()}).fetch();

    ReactDOM.findDOMNode(this.refs.textUserName).value = Meteor.user().username;
    ReactDOM.findDOMNode(this.refs.textUserName).disabled = true;
    if (users_data.length > 0) { 
      if (users_data[0].email != undefined)
        ReactDOM.findDOMNode(this.refs.textEmail).value = users_data[0].email;
      if (users_data[0].fullName != undefined)
        ReactDOM.findDOMNode(this.refs.textFullName).value = users_data[0].fullName;
      if (users_data[0].agencyName != undefined)
        ReactDOM.findDOMNode(this.refs.AgencyName).value = users_data[0].agencyName;
      if (users_data[0].type != "Select Type")
        ReactDOM.findDOMNode(this.refs.textType).value = users_data[0].type;
    }
    else {
      ReactDOM.findDOMNode(this.refs.textEmail).value = "";
      ReactDOM.findDOMNode(this.refs.textFullName).value = "";
      ReactDOM.findDOMNode(this.refs.textType).value = "Select Type";
    }

    if (ReactDOM.findDOMNode(this.refs.textType).value == "Agency") {
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
      ReactDOM.findDOMNode(this.refs.AgencyID).value = users_data[0].agencyID;
    }
    
  }

  
  render() {
    var userDataAvailable = true;
    var currentUser = this.props.currentUser;
    if(currentUser == undefined) {
      userDataAvailable = false;      
    }
    var loggedOut = (!currentUser && userDataAvailable);
    var loggedIn = (currentUser && userDataAvailable);
    return (<div>User ID: {this.props.params.user_id} <br/> Edit (True/False): 
    {this.props.params.edit}
    {loggedIn && this.state.ready ? 
              <form name="userForm" onSubmit={this.handleSubmit.bind(this)} >
                <table width="100%">
                  <tr>
                    <td width="30%">UserName:</td>
                    <td><input type="text" ref="textUserName" value={Meteor.username}/><br/></td>
                  </tr>
                  <tr>
                    <td>FullName:</td>
                    <td><input type="text" ref="textFullName" placeholder="Full Name"/><br/></td>
                  </tr>
                  <tr>
                    <td>Email:</td> 
                    <td><input type="text" ref="textEmail" placeholder="Email Address"/><br/></td>
                  </tr>
                  <tr>
                    <td>Type:</td> 
                    <td>
                      <select name="UserType" ref="textType">
                        <option value="Select Type" selected disabled>Select Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="Agency">Agency</option>
                  </select><br/></td>
                  </tr>
                  <tr>
                    <td colspan="2"><div ref="AgencyDiv" hidden>Agency Name: <input type="text" ref="AgencyName" placeholder="Agency Name"/><br/></div></td>
                  </tr>
                  <tr>
                    <td colspan="2"><input width="50%" type="submit" value="Update"/><br/></td>
                  </tr>
                </table>
          </form> : null}
          <form name="postTweet" onSubmit={this.postTweet.bind(this)} >
            <h2>Enter tweet to post: </h2>
            <input type="text" ref="textTweet" placeholder="Enter tweet here"/><br/>
            <input type="submit" value="Post"/>
          </form>
    
    </div>);
  }
}

User.propTypes = {
  user_data: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  Meteor.subscribe('userData');
  const user_data = UserData_db.find({originalUserId: Meteor.userId()}).fetch();
  const currentUser = Meteor.user();
  return {
        //report_item,
        user_data,
        currentUser,
      };
}, User);