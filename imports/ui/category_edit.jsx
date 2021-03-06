import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

// this component is used to render page to edit incident category
class Category extends TrackerReact(React.Component) {
    constructor() {
        super();

        // subscribe to necessary database tables / collections
        const subscription = Meteor.subscribe('incidentType', {onReady: function() {
            this.setState({
                ready: subscription.ready()
            })
        }.bind(this)});

        // react tracker state to manage callback when subscription is ready
        this.state = {
            ready: subscription.ready(),
            subscription: subscription
        }
    }

    // handle form submission
    handleSubmit(event) {
        event.preventDefault();
 
        // Find the text fields via the React ref
        const name = ReactDOM.findDOMNode(this.refs.textName).value.trim();
        const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
        
        // if new category, insert into database
        if(this.props.category_id == 0) {
            Meteor.call('incidentType.insert', name, description);
        }
        // else, update existing data
        else {
            Meteor.call('incidentType.update', this.props.category_id, name, description);
        }
        Bert.alert( 'Category has been updated!', 'success', 'fixed-top', 'fa-check' );

        // redirect to view page
        browserHistory.push('/category/view')
    }

    // load data into page and access control
    renderIncidentTypeData() {

        // for existing data, load the data into text fields
        if(this.props.category_data.length > 0) {
            ReactDOM.findDOMNode(this.refs.textName).value = this.props.category_data[0].name;
            ReactDOM.findDOMNode(this.refs.textAreaDescription).value = this.props.category_data[0].description;
        }

        // access control
        if(Roles.userIsInRole(Meteor.userId(), ['Admin', 'Operator'])) {
            document.getElementById("incidentTypeForm").disabled = false;
        }
        else {
            document.getElementById("incidentTypeForm").disabled = true;
        }
    }

    // stop subscription
    componentWillUnmount() {
        this.state.subscription.stop();
    }

    // page rendering
    render() {     
        return (<div>
            <form name="incidentTypeForm" onSubmit={this.handleSubmit.bind(this)} >
                <fieldset id="incidentTypeForm">
                <table width="100%">
                    <tr>
                        <td width="15%">Name:</td> 
                        <td><input type="text" size="40" ref="textName" placeholder="Name" required/></td>
                    </tr>
                    <tr>
                        <td>Description:</td>
                        <td><textarea rows="4" cols="40" ref="textAreaDescription" placeholder="Description" required/></td>
                    </tr>
                    <tr>
                        <td colspan="2"><input width="50%" type="submit" value="Update"/></td>
                    </tr>
                </table>
                </fieldset>
            </form>
            {this.state.ready ? this.renderIncidentTypeData() : null}
            <br/>
            <Link to =  "/category/view" activeClassName="active">← Back to list of Categories</Link>
        </div>);
    }
};

// return Category components to be rendered
export default createContainer(({params}) => {
    // get category id from url and load from database, if any
    const category_id = params.incidentType_id;
    const category_data = IncidentType_db.find({_id: params.incidentType_id}).fetch();
    return {        
        category_id,
        category_data,
    };
}, Category);