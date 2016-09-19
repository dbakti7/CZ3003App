import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import Report from './report.jsx';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IncidentType_db} from '../api/incidentType.js';

class Reports_View extends TrackerReact(React.Component) {
  constructor() {
      super();
      const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready()
        });
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

  
  render() {
    
    return (<div>
          <ul>
          {this.state.ready ? this.renderReports() : null}
          </ul> 
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