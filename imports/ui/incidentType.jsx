import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router'
import {IncidentType_db} from '../api/incidentType.js';


// Task component - represents a single todo item
export default class IncidentType extends Component {
  deleteIncidentType() {
    IncidentType_db.remove(this.props.incidentType._id);
  }
  subscribeIncidentType() {
    Meteor.call('incidentType.addSubscriber', this.props.incidentType._id, this.props.userID)
    alert("Subscribed!")
  }
  render() {
    return (
      <tbody>
        <tr>
          <td><li></li></td>
          <td><Link to = {`/category/${this.props.incidentType._id}/0`} activeClassName="active">{this.props.incidentType.name}</Link></td>
          <td>
            <button className="subscribe" onClick={this.subscribeIncidentType.bind(this)}>SUBSCRIBE</button>
            <button className="delete" onClick={this.deleteIncidentType.bind(this)}>DELETE</button>
          </td>
        </tr>
      </tbody>
    );
  }
}
 
IncidentType.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  incidentType: PropTypes.object.isRequired,
};