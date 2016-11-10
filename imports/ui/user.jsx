import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {browserHistory } from 'react-router'

// this component is used to render user profile page
class User extends Component {
	constructor() {
		super();
		lat = 0;
		lng = 0;
		locationName = "";
		
		// subscribe to necessary database tables / collections
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
			ready : userSubscription.ready() && userAuxSubscription.ready(),
			userSubscription: userSubscription,
			subscription: subscription,
			userAuxSubscription: userAuxSubscription
		} 
	}
	
	// handle form submission
	handleSubmit(event) {
		event.preventDefault();
 
		// Find the text fields via the React ref
		const userName = ReactDOM.findDOMNode(this.refs.textUserName).value.trim();
		if(this.props.newUser) {
      		var password = ReactDOM.findDOMNode(this.refs.textPassword).value.trim();
		}
		const fullName = ReactDOM.findDOMNode(this.refs.textFullName).value.trim();
		const email = ReactDOM.findDOMNode(this.refs.textEmail).value.trim();
		const phone = ReactDOM.findDOMNode(this.refs.textPhone).value.trim();
		const type = ReactDOM.findDOMNode(this.refs.textType).value;
		const agencyName = ReactDOM.findDOMNode(this.refs.AgencyName).value.trim();

		// some access controls
		returnFlag = false
      	if(ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden == true)
        	returnFlag = true
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
      
		// if new user, add into database
		if(this.props.newUser) {
			Meteor.call('userAux.addUser', userName, password, function(err, result) {
				Meteor.call('userData.update', result, fullName, email, type, agencyName, phone, locationName, lat, lng, function(err1, result1){
					Meteor.call('setRole', result, type);
				})
			});
		}
		// else, update existing data
		else {
			Meteor.call('userData.update', this.props.currentActiveUserId, fullName, email, type, agencyName, phone, locationName, lat, lng);
			Meteor.call('setRole', this.props.currentActiveUserId, type);
		}
        Bert.alert( 'User data has been updated!', 'success', 'fixed-top', 'fa-check' );
    	
		// redirect to view page
		browserHistory.push('/users/view')
	}

	// load data from database and update text fields accordingly
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

		// access control
		if (ReactDOM.findDOMNode(this.refs.textType).value == "Agency") {
			ReactDOM.findDOMNode(this.refs.AgencyDiv).hidden = false;
			ReactDOM.findDOMNode(this.refs.locationDiv).hidden = false;
			ReactDOM.findDOMNode(this.refs.AgencyID).value = data.agencyID;
			ReactDOM.findDOMNode(this.refs.textLocation).value = data.region;
		}
	}

	// autocomplete api from Google for places
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

	// stop subscription
    componentWillUnmount() {
        this.state.userSubscription.stop();
		this.state.subscription.stop();
		this.state.userAuxSubscription.stop();
    }

	// page rendering
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
		return (<div>
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
                  		</select><br/>
						</td>
                  	</tr>
                </table>
							
				<div ref="AgencyDiv" hidden><table width="100%"><tr><td width="30%">Agency Name: </td>
				<td><input type="text" ref="AgencyName" placeholder="Agency Name"/><br/></td></tr></table></div>
				<div ref="locationDiv" hidden><table width="100%"><tr><td width="30%">Location: </td>
				<td><input type="text" size="40" id="location" ref="textLocation" placeholder="Location" onFocus={this.autocomplete}/><br/></td></tr></table></div>
                <table width="100%">
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

// return User component to be rendered
export default createContainer(({params}) => {
	const user_data = UserData_db.find({originalUserId: params.user_id}).fetch()[0];
	const currentUser = Meteor.user();
	const newUser = (params.user_id == 0)
	const currentActiveUserId = (params.user_id)
	const currentActiveUser = Meteor.call('userAux.find', params.user_id) 
	return {
		user_data,
        currentUser,
        newUser,
        currentActiveUserId,
        currentActiveUser,
	};
}, User);