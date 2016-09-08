import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
class Report extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    alert(text)
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    return (<div>
      <h2>Report Page</h2>
    <form name="reportCase" onSubmit={this.handleSubmit.bind(this)} >
            Title: <input type="text" ref="textTitle" placeholder="Type to add new tasks"/><br/>
            Location: <input type="text" ref="textLocation" placeholder="Location"/><br/>
            Description: <textarea ref="textAreaDescription" placeholder="Description"/><br/>
            <input width="50%" type="submit" value="Report"/>
          </form></div>)
  }
}

export default createContainer(() => {
  return {
    
  };
}, Report);