import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import IncidentType from './incidentType.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IndexLink, Link } from 'react-router'

class Category extends TrackerReact(React.Component) {

  constructor() {
    super();
    const subscription = Meteor.subscribe('incidentType', {onReady: function() {
      this.setState({
        ready: subscription.ready()
      })
    }.bind(this)});

    this.state = {
      ready: subscription.ready(),
      subscription: subscription
    }
  }


  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.textName).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
    
    if(this.props.category_id == 0) {
      Meteor.call('incidentType.insert', name, description);
    }
    else {
      Meteor.call('incidentType.update', this.props.category_id, name, description);
    }
         
    //alert("Incident type has been updated!");
      Bert.alert( 'Incident type has been updated!', 'success', 'fixed-top', 'fa-check' );
    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  renderIncidentTypeData() {

    if(this.props.category_data.length > 0) {
      ReactDOM.findDOMNode(this.refs.textName).value = this.props.category_data[0].name;
      ReactDOM.findDOMNode(this.refs.textAreaDescription).value = this.props.category_data[0].description;
    }
  }

  componentWillUnmount() {
    this.state.subscription.stop();
  }

  render() {     
    return (<div>
                <form name="incidentTypeForm" onSubmit={this.handleSubmit.bind(this)} >
                <table width="100%">
                    <tr>
                        <td width="15%">Name:</td> 
                        <td><input type="text" ref="textName" placeholder="Name"/></td>
                    </tr>
                    <tr>
                        <td>Description:</td>
                        <td><textarea ref="textAreaDescription" placeholder="Description"/></td>
                    </tr>
                    <tr>
                        <td colspan="2"><input width="50%" type="submit" value="Update"/></td>
                    </tr>
                </table>
                </form>
          {this.state.ready ? this.renderIncidentTypeData() : null}
          <br/>
          <Link to =  "/category/view" activeClassName="active">← Back to list of Incident Types</Link>
    </div>);
  }
};


export default createContainer(({params}) => {
  const category_id = params.incidentType_id;
  const category_data = IncidentType_db.find({_id: params.incidentType_id}).fetch();
  console.log(category_data)
  return {        
         category_id,
         category_data,
       };
}, Category);