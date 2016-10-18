import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router'
import {Reports_db} from '../api/report.js';
// Task component - represents a single todo item
export default class Report extends Component {
  deleteReport() {
    Reports_db.remove(this.props.report._id);
  }
  render() {
    return (
      <tbody>
        <tr> 
          <td><li></li></td>
          <td>
            <Link to = {`/report/${this.props.report._id}/0`} activeClassName="active">{this.props.report.title}</Link>
          </td>
          <td>
            <button className="delete" onClick={this.deleteReport.bind(this)}>Delete Report</button>
          </td>
        </tr>
      </tbody>
    );
  }
}
 
Report.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  report: PropTypes.object.isRequired,
};