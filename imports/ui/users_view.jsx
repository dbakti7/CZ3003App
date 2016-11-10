import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// this component is used to render page to view all users
class Users_View extends TrackerReact(React.Component) {
	constructor() {
		super();
		
		// subscribe to necessary database tables / collections
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

		// react tracker state to manage callback when subscription is ready
		this.state = {
			ready : userSubscription.ready() && userAuxSubscription.ready(),
			userAuxSubscription: userAuxSubscription,
			userSubscription: userSubscription
		}
	}

	// render action buttons
	editFormatter(cell, row){
		return  
			<div>
			<Link to = {`/user/${cell}/0`} activeClassName="active"><button >Edit</button></Link>
				<button className="delete" onClick={function() {
					if(confirm("Are you sure you want to delete this?")){
						Meteor.call('userData.remove', cell);
						Bert.alert( 'Deleted!', 'success', 'fixed-top', 'fa-check' );
					}
				}} >Delete</button>
            </div>;
	}

	// stop subscription
    componentWillUnmount() {
        this.state.userAuxSubscription.stop();
		this.state.userSubscription.stop();
    }

	// page rendering
	render() {
		userData = Meteor.users.find({}).fetch();
		return (<div>
				<BootstrapTable data={userData} striped={true} hover={true} pagination={true} search={true}>
				<TableHeaderColumn className="bsTableHeader" dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                <TableHeaderColumn className="bsTableHeader" dataField="username" dataSort={true}>User Name</TableHeaderColumn>
                <TableHeaderColumn className="bsTableHeader" dataField="roles" dataSort={true}>Account Type</TableHeaderColumn>
                <TableHeaderColumn className="bsTableHeader" dataField="_id" dataFormat={this.editFormatter}>Action</TableHeaderColumn> 
				</BootstrapTable>
				</div>
			   )
	}
}

// return Users_View components to be rendered
export default createContainer(({params}) => {
	return {
	};
}, Users_View);