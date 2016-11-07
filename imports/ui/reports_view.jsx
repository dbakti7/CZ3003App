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


class Reports_View extends TrackerReact(React.Component) {
  constructor() {
      super();
      var self = this;
      const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
        this.setState({
          
          ready : reportSubscription.ready()
        });
        console.log("here")
      }.bind(this)});
      
      this.state = {
        ready: reportSubscription.ready(),
      }
    }


  renderReports() {
    return this.props.reports.map((reports) => (
      <Report key={reports._id} report={reports} />
    ));
  }
  

  editFormatter(cell, row){
    // console.log("HAHAHA",cell);
    return  <div>
              <Link to = {`/report/${cell}/0`} activeClassName="active"><button >Edit</button></Link>
              <button className="delete" onClick={function() {
                Reports_db.remove(cell);
              }} >Delete</button>
            </div>;
  }
  
  render() {
    // console.log("ASS", this.props.reports);
    //  {this.state.ready ? this.renderReports() : null}
    reportData = this.props.reports;
    
    return (<div>
              <BootstrapTable data={reportData} striped={true} hover={true} pagination={true} search={true}>
                <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="title" dataSort={true}>Title</TableHeaderColumn>
                <TableHeaderColumn dataField="locationName" dataSort={true}>Location</TableHeaderColumn>
                <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
                <TableHeaderColumn dataField="_id" dataFormat={this.editFormatter}>Action</TableHeaderColumn> 
              </BootstrapTable>
            </div>)
          
  }
}

Reports_View.propTypes = {
  reports: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {

    const reports = Reports_db.find({}).fetch();
  
  return {
    reports,
  };
}, Reports_View);