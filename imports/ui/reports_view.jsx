import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import Report from './report.jsx';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IncidentType_db} from '../api/incidentType.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {Label} from 'react-bootstrap';

// this component is used to render page to list all incidents reported
class Reports_View extends TrackerReact(React.Component) {
    constructor() {
        super();
        var self = this;

        // subscribe to necessary database tables / collections
        const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
            this.setState({
                ready : reportSubscription.ready()
            });
        }.bind(this)});
        
        // react tracker state to manage callback when subscription is ready
        this.state = {
            ready: reportSubscription.ready(),
            reportSubscription: reportSubscription
        }
    }

    // formating for each status    
    statusFormatter(cell,row){
        if(cell=="Active"){
            return <h4><Label bsStyle="danger">Active</Label></h4>
        } else if(cell=="Resolved") {
            return <h4><Label bsStyle="success">Resolved</Label></h4>   
        } else if(cell=="Handled") {
            return <h4><Label bsStyle="warning">Handled</Label></h4>  
        }
    }
    
    // render action buttons for BootstrapTable
    editFormatter(cell, row){
        return  <div>
                <Link to = {`/report/${cell}/0`} activeClassName="active"><button >{Roles.userIsInRole(Meteor.userId(), ['Admin', 'Agency', 'Operator']) ? "Edit" : "View"}</button></Link>
                {Roles.userIsInRole(Meteor.userId(), ['Admin', 'Agency', 'Operator']) ? 
                <button className="delete" onClick={function() {
                    if(confirm("Are you sure you want to delete this?")){
                    Reports_db.remove(cell);
                    Bert.alert( 'Deleted!', 'success', 'fixed-top', 'fa-check' );
                    }
                }} >Delete</button> : null}
                </div>;
    }
    
    // stop subscription
    componentWillUnmount() {
        this.state.reportSubscription.stop();
    }

    // page rendering
    render() {
        reportData = this.props.reports;
        return (<div>
                <BootstrapTable data={reportData} striped={true} hover={true} pagination={true} search={true}>
                    <TableHeaderColumn className="bsTableHeader" dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="title" dataSort={true}>Title</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="locationName" dataSort={true}>Location</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataAlign="center" dataField="status" dataSort={true} dataFormat={this.statusFormatter}>Status</TableHeaderColumn>
                    <TableHeaderColumn className="bsTableHeader" dataField="_id" dataFormat={this.editFormatter}>Action</TableHeaderColumn> 
                </BootstrapTable>
                </div>)
            
    }
}

Reports_View.propTypes = {
  reports: PropTypes.array.isRequired,
};

// return Reports_View component to be rendered
export default createContainer(({params}) => {
    const reports = Reports_db.find({}).fetch();
    return {
        reports,
    };
}, Reports_View);