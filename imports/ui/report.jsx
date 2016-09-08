import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router'
// Task component - represents a single todo item
export default class Report extends Component {
  
  render() {
    return (
      <li><Link to = {`/report/${this.props.report._id}/0`} activeClassName="active">sf</Link></li>
    );
  }
}
 
Report.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  report: PropTypes.object.isRequired,
};