import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// this component is used to render page to list all incident categories
class Category extends TrackerReact(React.Component) {
    constructor() {
        super();

        // subscribe to necessary database tables / collections
        const subscription = Meteor.subscribe('incidentType', {onReady: function() {
            this.setState({
                ready: userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
            })
        }.bind(this)});

        const userSubscription = Meteor.subscribe('userData',{onReady: function() {
            this.setState({
                ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
            });
        }.bind(this)});

        const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
            this.setState({
                ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready()
            })
        }.bind(this)})

        // react tracker state to manage callback when subscription is ready
        this.state = {
            userID : Meteor.userId(),
            ready : userSubscription.ready() && userAuxSubscription.ready() && subscription.ready(),
            subscription: subscription,
            userSubscription: userSubscription,
            userAuxSubscription: userAuxSubscription
        }
    }

    // stop subscription
    componentWillUnmount() {
        this.state.subscription.stop();
        this.state.userSubscription.stop();
        this.state.userAuxSubscription.stop();
    }

    // render action buttons
    editFormatter(cell, row, UserID){
        // check whether user has already subscribed to email or sms
        isInside = function(curID, subscribers) {
            isIn = false;
            for (i = 0; i < subscribers.length; i++){
                if(curID == subscribers[i]){
                    isIn = true;
                    break;
                }
            }
            return isIn
        }

        var email = "EMAIL"
        var sms = "SMS"
        return  <div>
                {(!Roles.userIsInRole(Meteor.userId(), ['Operator', 'Admin']) && Meteor.user() != null)?
                    (isInside(UserID,row.emailSubscribers)?(
                    <button className="unsubscribe"onClick={function() {
                        Meteor.call('incidentType.removeSubscriber', cell, UserID, email)
                        //alert("Subscribed!")
                        Bert.alert( 'Unsubscribed', 'success', 'fixed-top', 'fa-check' );
                    // }}> {Meteor.call('incidentType.checkSubscribers', cell, UserID, email) ? "SUBSCRIBE EMAIL" : "UNSUBSCRIBE EMAIL"} </button> : null}  
                    }}> UNSUBSCRIBE EMAIL </button>
                    ):(
                    <button className="subscribe"onClick={function() {
                        Meteor.call('incidentType.addSubscriber', cell, UserID, email)
                        //alert("Subscribed!")
                        Bert.alert( 'Subscribed', 'success', 'fixed-top', 'fa-check' );
                    // }}> {Meteor.call('incidentType.checkSubscribers', cell, UserID, email) ? "SUBSCRIBE EMAIL" : "UNSUBSCRIBE EMAIL"} </button> : null}  
                    }}> SUBSCRIBE EMAIL </button>
                    )) : null}

                {(!Roles.userIsInRole(Meteor.userId(), ['Operator', 'Admin']) && Meteor.user() != null) ?
                    (isInside(UserID,row.smsSubscribers)?(
                    <button className="unsubscribe"onClick={function() {
                        Meteor.call('incidentType.removeSubscriber', cell, UserID, sms)
                        //alert("Subscribed!")
                        Bert.alert( 'Unsubscribed', 'success', 'fixed-top', 'fa-check' );
                    // }} >{Meteor.call('incidentType.checkSubscribers', cell, UserID, sms) ? "SUBSCRIBE SMS" : "UNSUBSCRIBE SMS"}</button> : null}
                    }} >UNSUBSCRIBE SMS</button>
                    ):(
                    <button className="subscribe"onClick={function() {
                        Meteor.call('incidentType.addSubscriber', cell, UserID, sms)
                        //alert("Subscribed!")
                        Bert.alert( 'Subscribed', 'success', 'fixed-top', 'fa-check' );
                    // }} >{Meteor.call('incidentType.checkSubscribers', cell, UserID, sms) ? "SUBSCRIBE SMS" : "UNSUBSCRIBE SMS"}</button> : null}
                    }} >SUBSCRIBE SMS</button>
                    )) : null}

                <Link to = {`/category/${cell}/0`} activeClassName="active"><button >{Roles.userIsInRole(Meteor.userId(), ['Admin']) ? "Edit" : "View"}</button></Link>

                {Roles.userIsInRole(Meteor.userId(), ['Admin']) ?
                <button className="delete" onClick={function() {
                    if(confirm("Are you sure you want to delete this?")){
                    IncidentType_db.remove(cell);
                    Bert.alert( 'Deleted!', 'success', 'fixed-top', 'fa-check' );
                    }
                    
                }} >Delete</button> : null}
                </div>;
    }

    // page rendering
    render() {
        categoryData = this.props.incidentType_data;
        return (<div>
                <BootstrapTable data={categoryData} striped={true} hover={true} pagination={true} search={true}>
                    <TableHeaderColumn className="bsTableHeader" dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="name" dataSort={true}>Category Name</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="description" dataSort={true}>Description</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="_id" dataFormat={this.editFormatter} formatExtraData={this.state.userID}>Action</TableHeaderColumn> 
                </BootstrapTable>         
                </div>);
    }
};

// return Category components to be rendered
export default createContainer(({params}) => {
    const incidentType_data = IncidentType_db.find({}).fetch();
    const category_id = params.incidentType_id;
    return {        
        incidentType_data,
        category_id,
    };
}, Category);