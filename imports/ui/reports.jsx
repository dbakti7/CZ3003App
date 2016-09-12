import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import Report from './report.jsx';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'

class Reports extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const title = ReactDOM.findDOMNode(this.refs.textTitle).value.trim();
    const location = ReactDOM.findDOMNode(this.refs.textLocation).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
    if(this.props.report_item.length > 0) {
      var reportArray = this.props.report_item;
      Meteor.call('reports.update', reportArray[0]._id, title, location, description);
    }
    else {      
      Meteor.call('reports.insert', title, Meteor.userId(), location, description);
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
      var RBU = this.props.reportedByUser[0];
      ReactDOM.findDOMNode(this.refs.textTitle).value = report.title;
      ReactDOM.findDOMNode(this.refs.textReportedBy).value = RBU.username;
      ReactDOM.findDOMNode(this.refs.textLocation).value = report.location;
      ReactDOM.findDOMNode(this.refs.textAreaDescription).value = report.description;
      // ReactDOM.findDOMNode(this.refs.textTitle).disabled = true;
      // ReactDOM.findDOMNode(this.refs.textLocation).disabled = true;
      // ReactDOM.findDOMNode(this.refs.textAreaDescription).disabled = true;
    //  return this.props.report_item.map((report_item) => {
    //    return (<h1>{report_item._id}</h1>)});
    }
  }

  // componentWillReceiveProps() {
  //     ReactDOM.findDOMNode(this.refs.textReportedBy).value = Meteor.user().username;
  // }
  render() {
    var userDataAvailable = true;
    var currentUser = this.props.currentUser;
    var reportedByUser = this.props.reportedByUser;
    var report_item = this.props.report_item;
    if(currentUser == undefined || (report_item.length > 0 && reportedByUser.length == 0) || report_item == undefined) {
      userDataAvailable = false;      
    }
    var loggedOut = (!currentUser && userDataAvailable);
    var loggedIn = (currentUser && userDataAvailable);
    return (<div>
      <h2>Report Page</h2>
      {loggedIn ? 
    <form name="reportCase" onSubmit={this.handleSubmit.bind(this)} >
            Title: <input type="text" ref="textTitle" placeholder="Type to add new tasks"/><br/>
            Reported By: <input type="text" ref="textReportedBy" disabled = "true"/><br/>
            Location: <input type="text" ref="textLocation" placeholder="Location"/><br/>
            Description: <textarea ref="textAreaDescription" placeholder="Description"/><br/>
            <input width="50%" type="submit" value="Report"/>
          </form> : null}
          <ul>
          {loggedIn ?
          this.renderReports() : null} 
          </ul>
          {loggedIn ? this.renderReportItem() : null}
          </div>)
          
  }
}
// <li><Link to =  "/" activeClassName="active">Index</Link></li>
//           <li><Link to = "/map" activeClassName="active">Map</Link></li>

Reports.propTypes = {
  reports: PropTypes.array.isRequired,
};

export default createContainer(({params}) => {
  Meteor.subscribe('reports');
  Meteor.subscribe('users');

  const report_item = Reports_db.find({_id: params.report_id}).fetch()
  const reportedByUser = report_item.length > 0 ? Meteor.users.find({_id: report_item[0].reportedBy}).fetch() : []
  const user_list = Meteor.users.find({}).fetch();
  const currentUser = Meteor.user();
  return {
    report_item,
    reportedByUser,
    user_list,
    currentUser,
    reports: Reports_db.find({}).fetch(),
  };
}, Reports);