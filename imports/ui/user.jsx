import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {browserHistory } from 'react-router'

class User extends Component {
  constructor() {
      super();
      var lat = 0;
      var lng = 0;
      var locationName = "";
      
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
    if(this.props.newUser) {
      var password = ReactDOM.findDOMNode(this.refs.textPassword).value.trim();
      
    }
    const fullName = ReactDOM.findDOMNode(this.refs.textFullName).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.textEmail).value.trim();
    const phone = ReactDOM.findDOMNode(this.refs.textPhone).value.trim();
    const type = ReactDOM.findDOMNode(this.refs.textType).value;
    const agencyName = ReactDOM.findDOMNode(this.refs.AgencyName).value.trim();
    returnFlag = false
      if(ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden == true)
        returnFlag = true
    console.log(returnFlag)
    if(type != "Agency") {
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = true;
      ReactDOM.findDOMNode(this.refs.locationDiv).hidden = true;
    }
    else {
      
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
      ReactDOM.findDOMNode(this.refs.locationDiv).hidden = false;
      if(returnFlag)
        return;
    }
      
    if(this.props.newUser) {
       Meteor.call('userAux.addUser', userName, password, function(err, result) {
         Meteor.call('userData.update', result, fullName, email, type, agencyName, phone, locationName, lat, lng, function(err1, result1) {
           Meteor.call('setRole', result, type);
         })
       });
     }
     else {
       Meteor.call('userData.update', this.props.currentActiveUserId, fullName, email, type, agencyName, phone, locationName, lat, lng);
       Meteor.call('setRole', this.props.currentActiveUserId, type);
     }
    
         
    //alert("User data has been updated!");
    Bert.alert( 'User data has been updated!', 'success', 'fixed-top', 'fa-check' );
    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
    browserHistory.push('/users/view')
  }

  postTweet(event) {
    event.preventDefault();

    Meteor.call("postTweet", this.refs.textTweet.value, function(err,result) {
    if(!err) {
        //alert("Tweet posted");
        Bert.alert({
          type: 'TwitterPosted',
          style: 'growl-top-right',
          title: 'Tweet Posted!',
          //message: 'Final Fantasy VII',
          icon: 'fa-twitter'
        });
    }
    });
  }

  postFB(event) {
    event.preventDefault();

    Meteor.call("postToFacebook", this.refs.textFB.value, function(err,result) {
    if(!err) {
        //alert("Posted to Facebook!");
        Bert.alert({
          type: 'FacebookPosted',
          style: 'growl-top-right',
          title: 'Posted to Facebook!',
          //message: 'Final Fantasy VII',
          icon: 'fa-facebook'
        });
    }
    });
  }

  sendSMS(event) {
    event.preventDefault();

    Meteor.call("sendSMS", this.refs.textSMS.value,this.refs.phone.value, function(err,result) {
    if(!err) {
      //alert("send SMS!");
        Bert.alert({
          type: 'SMSSent',
          style: 'growl-top-right',
          title: 'SMS Sent!',
          //message: 'Final Fantasy VII',
          icon: 'fa-send'
        });
    }
    });
  }

  // componentWillReceiveProps() {
  //   var users_data = UserData_db.find({originalUserId: Meteor.userId()}).fetch();
  //   if(!this.props.newUser)
  //      ReactDOM.findDOMNode(this.refs.textUserName).value = Meteor.user().username;
  //    // ReactDOM.findDOMNode(this.refs.textUserName).disabled = !this.props.newUser;
  //    if (users_data.length > 0 && !this.props.newUser) { 
  //     if (users_data[0].email != undefined)
  //       ReactDOM.findDOMNode(this.refs.textEmail).value = users_data[0].email;
  //     if (users_data[0].fullName != undefined)
  //       ReactDOM.findDOMNode(this.refs.textFullName).value = users_data[0].fullName;
  //     if (users_data[0].agencyName != undefined)
  //       ReactDOM.findDOMNode(this.refs.AgencyName).value = users_data[0].agencyName;
  //     if (users_data[0].type != "Select Type")
  //       ReactDOM.findDOMNode(this.refs.textType).value = users_data[0].type;
  //   }
  //   else {
  //     ReactDOM.findDOMNode(this.refs.textEmail).value = "";
  //     ReactDOM.findDOMNode(this.refs.textFullName).value = "";
  //     ReactDOM.findDOMNode(this.refs.textType).value = "Select Type";
  //   }

  //   if (ReactDOM.findDOMNode(this.refs.textType).value == "Agency") {
  //     ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
  //     ReactDOM.findDOMNode(this.refs.AgencyID).value = users_data[0].agencyID;
  //   }
    
  // }
updateValues() {
    var users_data = UserData_db.find({originalUserId: Meteor.userId()}).fetch();
    var data = this.props.user_data;
    var self = this
    Meteor.call('userAux.find', this.props.currentActiveUserId, function(err, result) {
       ReactDOM.findDOMNode(self.refs.textUserName).value = result[0].username;
    })
     // ReactDOM.findDOMNode(this.refs.textUserName).disabled = !this.props.newUser;
     if (users_data.length > 0 && !this.props.newUser) { 
      if (data.email != undefined)
        ReactDOM.findDOMNode(this.refs.textEmail).value = data.email;
      if (data.phone != undefined)
        ReactDOM.findDOMNode(this.refs.textPhone).value = data.phone;
      if (data.fullName != undefined)
        ReactDOM.findDOMNode(this.refs.textFullName).value = data.fullName;
      if (data.agencyName != undefined)
        ReactDOM.findDOMNode(this.refs.AgencyName).value = data.agencyName;
      if (data.region != undefined)
        document.getElementById('location').value = data.region;
      ReactDOM.findDOMNode(this.refs.textType).value = data.type;
    }
    else {
      ReactDOM.findDOMNode(this.refs.textEmail).value = "";
      ReactDOM.findDOMNode(this.refs.textFullName).value = "";
      if(!this.props.newUser)
        ReactDOM.findDOMNode(this.refs.textType).value = "PublicUser";
      else
        ReactDOM.findDOMNode(this.refs.textType).value = "Admin";
    }

    if (ReactDOM.findDOMNode(this.refs.textType).value == "Agency") {
      ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
      ReactDOM.findDOMNode(this.refs.locationDiv).hidden = false;
      ReactDOM.findDOMNode(this.refs.AgencyID).value = data.agencyID;
      ReactDOM.findDOMNode(this.refs.textLocation).value = data.region;
    }
    
  }
  
autocomplete() {
    if (GoogleMaps.loaded()) {
      var input = document.getElementById("location");
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          locationName = place.name;
          lat = place.geometry.location.lat();
          lng = place.geometry.location.lng();
      })
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
    var initial = "initial"
    var noneStr = "none"
    return (<div>User ID: {this.props.params.user_id} <br/> Edit (True/False): 
    {this.props.params.edit}
    
              <form name="userForm" onSubmit={this.handleSubmit.bind(this)} >
                <table width="100%">
                  <tr>
                    <td width="30%">UserName:</td>
                    <td><input type="text" ref="textUserName" disabled={!this.props.newUser} placeholder={this.props.newUser ? "UserName" : ""}/><br/></td>
                  </tr>
                  <tr>
                    <td>FullName:</td>
                    <td><input type="text" ref="textFullName" placeholder="Full Name"/><br/></td>
                  </tr>
                  {this.props.newUser ? 
                   <tr>
                     <td>Password:</td>
                     <td><input type="password" ref="textPassword" placeholder="Password"/><br/></td>
                   </tr> : null}
                  <tr>
                    <td>Email:</td> 
                    <td><input type="email" ref="textEmail" placeholder="Email Address"/><br/></td>
                  </tr>
                  <tr>
                    <td>Phone Number:</td> 
                    <td><input type="tel" ref="textPhone" placeholder="Phone Number"/><br/></td>
                  </tr>
                  <tr style={{display: (this.props.newUser ? "initial" : "none")}}>
                    <td>Type:</td> 
                    <td>
                      <select name="UserType" ref="textType">
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="Agency">Agency</option>
                        <option value="PublicUser">Public User</option>
                  </select><br/></td>
                  </tr>
                  <tr>
                    <td colspan="2"><div ref="AgencyDiv" hidden>Agency Name: <input type="text" ref="AgencyName" placeholder="Agency Name"/><br/></div></td>
                  </tr>
                  <tr>
                    <td colspan="2"><div ref="locationDiv" hidden>Location: <input type="text" size="40" id="location" ref="textLocation" placeholder="Location" onFocus={this.autocomplete}/><br/></div></td>
                  </tr>
                  <tr>
                    <td colspan="2"><input width="50%" type="submit" value="Update"/><br/></td>
                  </tr>
                </table>
          </form>
          {this.state.ready ? this.updateValues() : null}
    </div>);
  }
}

User.propTypes = {
  user_data: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  const user_data = UserData_db.find({originalUserId: params.user_id}).fetch()[0];
  const currentUser = Meteor.user();
  const newUser = (params.user_id == 0)
  const currentActiveUserId = (params.user_id)
  const currentActiveUser = Meteor.call('userAux.find', params.user_id) 
  return {
        //report_item,
        user_data,
        currentUser,
        newUser,
        currentActiveUserId,
        currentActiveUser,
      };
}, User);