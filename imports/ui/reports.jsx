import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import Report from './report.jsx';
import { Meteor } from 'meteor/meteor';

class Reports extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const titleTest = ReactDOM.findDOMNode(this.refs.textTitle).value.trim();
    Meteor.call('reports.insert', titleTest);
    alert(titleTest)
    // Clear form
    ReactDOM.findDOMNode(this.refs.textTitle).value = '';
  }

  renderReports() {
    return this.props.reports.map((reports) => (
      <Report key={reports._id} report={reports} />
    ));
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
          </ul></div>)
          
  }
}

Reports.propTypes = {
  reports: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('reports');
  return {
    reports: Reports_db.find({}).fetch(),
  };
}, Reports);