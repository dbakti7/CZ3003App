import React from 'react'

export default React.createClass({
  render() {
    return <div>User ID: {this.props.params.user_id} <br/> Edit (True/False): 
    {this.props.params.edit}</div>
  }
})