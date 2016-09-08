import React, { Component, PropTypes } from 'react';

// Task component - represents a single todo item
export default class Report extends Component {
  render() {
    return (
      <li>{this.props.report.text}</li>
    );
  }
}
 
Report.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  report: PropTypes.object.isRequired,
};