import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import Report from './report.jsx';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IncidentType_db} from '../api/incidentType.js';


class Reports_Edit extends TrackerReact(React.Component) {
  constructor() {
      super();
      const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
        });
      }.bind(this)});
      
      const userSubscription = Meteor.subscribe('userData',{onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
        });
      }.bind(this)});
      const subscription = Meteor.subscribe('incidentType');

      const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
        })
      }.bind(this)})

      const incidentTypeSubscription = Meteor.subscribe('incidentType', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
        })
      }.bind(this)})
      this.state = {
        ready: reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready(),
        rSubscription: reportSubscription,
        uSubscription: userSubscription,
        incidentTypeSubscription: incidentTypeSubscription,
      }
    }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const title = ReactDOM.findDOMNode(this.refs.textTitle).value.trim();
    const location = ReactDOM.findDOMNode(this.refs.textLocation).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
    const incidentType_id = ReactDOM.findDOMNode(this.refs.incidentType).value.trim();
    if(this.props.report_item.length > 0) {
      var reportArray = this.props.report_item;
      Meteor.call('reports.update', reportArray[0]._id, title, location, description, incidentType_id);
    }
    else {      
      Meteor.call('reports.insert', title, Meteor.userId(), location, description, incidentType_id);
    }

    // Clear form
    ReactDOM.findDOMNode(this.refs.textTitle).value = '';
    ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  renderReports() {
    return this.props.reports.map((reports) => (
      <Report key={reports._id} report={reports} />
    ));
  }

  renderReportItem() {
    if(this.props.report_item.length > 0) {
      var report = this.props.report_item[0];      
      var textRB = ReactDOM.findDOMNode(this.refs.textReportedBy);
      if(this.state.ready) {
        var RBU = null;
        Meteor.call('userAux.find', this.props.report_item[0].reportedBy, function(error, result) {
          RBU = result[0];
          textRB.value = RBU.username;
        });
      }
      ReactDOM.findDOMNode(this.refs.textTitle).value = report.title;
      ReactDOM.findDOMNode(this.refs.textLocation).value = report.location;
      ReactDOM.findDOMNode(this.refs.textAreaDescription).value = report.description;
      ReactDOM.findDOMNode(this.refs.incidentType).value = report.incidentType_id;
    }
    else {
        var textRB = ReactDOM.findDOMNode(this.refs.textReportedBy);
        var RBU = null;
        Meteor.call('userAux.find', Meteor.userId(), function(error, result) {
          RBU = result[0];
          textRB.value = RBU.username;
        });
    }
  }

  render() {
    var currentUser = this.props.currentUser;
    var reportedByUser = this.props.reportedByUser;
    var report_item = this.props.report_item;
    
    return (<div>
      <h2>Report Page</h2> 
    <form name="reportCase" onSubmit={this.handleSubmit.bind(this)} >
            Title: <input type="text" ref="textTitle" placeholder="Type to add new tasks"/><br/>
            Reported By: <input type="text" ref="textReportedBy" disabled = "true"/><br/>
            Location: <input type="text" ref="textLocation" placeholder="Location"/><br/>
            Description: <textarea ref="textAreaDescription" placeholder="Description"/><br/>
            <select ref="incidentType" defaultValue="" required>
            <option value="" disabled>Incident Type</option>
            {
              this.props.incidentTypeList.map(function(incidentType) {
                return <option key={incidentType._id}
                  value={incidentType._id}>{incidentType.name}</option>;
              })
            }
          </select><br/>
            <input width="50%" type="submit" value="Report"/>
          </form>
          {this.state.ready ? this.renderReportItem() : null}
          <Link to =  "/reports/view" activeClassName="active">Back to list of reports</Link>
          </div>)
          
  }
}

Reports_Edit.propTypes = {
  reports: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  
    const new_report = params.report_id == 0
    const report_item = Reports_db.find({_id: params.report_id}).fetch()
    
    const reportedByUser = report_item.length > 0 ? Meteor.users.find({_id: report_item[0].reportedBy}).fetch() : []
    const user_list = Meteor.users.find({}).fetch();
    const currentUser = Meteor.user();
    const incidentTypeList = IncidentType_db.find({}).fetch();
  
  return {
    new_report,
    report_item,
    reportedByUser,
    user_list,
    currentUser,
    incidentTypeList,
  };
}, Reports_Edit);