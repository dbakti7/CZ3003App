import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IndexLink, Link } from 'react-router'
import { Accounts } from 'meteor/accounts-base'

// this component is used to render Reset Password page
class ResetPassword extends TrackerReact(React.Component) {
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
    
        const password = ReactDOM.findDOMNode(this.refs.textPassword).value.trim();

        // reset user's password
        if(this.state.ready) {
            Meteor.call('userAux.setPassword', this.props.userID, password)
        }
        
        Bert.alert( 'Your Password has been reset!', 'success', 'fixed-top', 'fa-check' );
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
                New Password: <input type="text" ref="textPassword" placeholder="Name"/><br/>
                <input width="50%" type="submit" value="Update"/>
            </form>
        </div>);
    }
};

// return ResetPassword component to be rendered
export default createContainer(({params}) => {
    const userID = params.user_id 
    return {        
        userID,
    };
}, ResetPassword);