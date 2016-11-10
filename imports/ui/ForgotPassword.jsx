import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IndexLink, Link } from 'react-router'
import { Accounts } from 'meteor/accounts-base'

// this component is used to render Forgot Password page
class ForgotPassword extends TrackerReact(React.Component) {
    constructor() {
        super();
      
        // subscribe to necessary database tables / collections
        const userSubscription = Meteor.subscribe('userData',{onReady: function() {
            this.setState({
            ready : userSubscription.ready() && userAuxSubscription.ready()
            });
        }.bind(this)});


        const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
            this.setState({
            ready : userSubscription.ready() && userAuxSubscription.ready()
            })
        }.bind(this)})

        // react tracker state to manage callback when subscription is ready
        this.state = {
            ready : userSubscription.ready() && userAuxSubscription.ready(),
            userSubscription: userSubscription,
            userAuxSubscription: userAuxSubscription
        }
    }
  
    // handle form submission
    handleSubmit(event) {
        event.preventDefault();
    
        // Find the text field via the React ref
        const email = ReactDOM.findDOMNode(this.refs.textEmail).value.trim();
        var userFound = 0

        // send the email to user email for reset password link
        if(this.state.ready) {
            Meteor.call('userAux.findByEmail', email, function(error, result) {
            userFound = result[0];
            title = "Email Reset"
            description = "Click the following link to reset your password: http://localhost:3000/reset_password/" + userFound._id
            Meteor.call('sendEmail', email, title, description)
            });
        }
    }

    // stop subscription
    componentWillUnmount() {
        this.state.userAuxSubscription.stop();
		this.state.userSubscription.stop();
    }

    // page rendering
    render() {     
        return (<div>
        <form name="incidentTypeForm" onSubmit={this.handleSubmit.bind(this)} >
                Email: <input type="text" ref="textEmail" placeholder="Name"/><br/>
                <input width="50%" type="submit" value="Update"/>
            </form>
            <Link to =  "/category/view" activeClassName="active">Back to list of Incident Types</Link>
        </div>);
    }
};

// return ForgotPassword component to be rendered
export default createContainer(({params}) => {
    return {        
        };
}, ForgotPassword);