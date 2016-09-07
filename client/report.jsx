import React from 'react'

export default React.createClass({
  render() {
    return <div>Report ID: {this.props.params.report_id} <br/> Edit (True/False): 
    {this.props.params.edit}</div>
  }
})