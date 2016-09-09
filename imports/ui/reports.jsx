import React, { Component, PropTypes } from 'react';
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
      Meteor.call('reports.insert', title, location, description);
    }
    Meteor.call('users.insert', title, location);

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
      var reportArray = this.props.report_item;
      ReactDOM.findDOMNode(this.refs.textTitle).value = reportArray[0].title;
      ReactDOM.findDOMNode(this.refs.textLocation).value = reportArray[0].location;
      ReactDOM.findDOMNode(this.refs.textAreaDescription).value = reportArray[0].description;
      // ReactDOM.findDOMNode(this.refs.textTitle).disabled = true;
      // ReactDOM.findDOMNode(this.refs.textLocation).disabled = true;
      // ReactDOM.findDOMNode(this.refs.textAreaDescription).disabled = true;
    //  return this.props.report_item.map((report_item) => {
    //    return (<h1>{report_item._id}</h1>)});
    }
  }
  render() {
    return (<div>
      <h2>Report Page</h2>
    <form name="reportCase" onSubmit={this.handleSubmit.bind(this)} >
            Title: <input type="text" ref="textTitle" placeholder="Type to add new tasks"/><br/>
            Location: <input type="text" ref="textLocation" placeholder="Location"/><br/>
            Description: <textarea ref="textAreaDescription" placeholder="Description"/><br/>
            <input width="50%" type="submit" value="Report"/>
          </form>
          <ul>
          {this.renderReports()}
          </ul>
          {this.renderReportItem()}
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
  return {
    report_item,
    reports: Reports_db.find({}).fetch(),
  };
}, Reports);