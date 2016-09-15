import React, { Component, PropTypes, componentDidMount, componentWillReceiveProps} from 'react';
import {UserData_db} from '../api/userData.js';
import {IncidentType_db} from '../api/incidentType.js';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import IncidentType from './incidentType.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class Category extends TrackerReact(React.Component) {

  constructor() {
    super();
    const subscription = Meteor.subscribe('incidentType');
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
    
    Meteor.call('incidentType.insert', name, description);     
    alert("Incident type has been updated!");
    // Clear form
    // ReactDOM.findDOMNode(this.refs.).value = '';
    // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
    // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
  }

  renderIncidentTypes() {
    return this.props.incidentType_data.map((incidentType_data) => (
      <IncidentType key={incidentType_data._id} incidentType={incidentType_data} />
    ));
  }

  componentWillUnmount() {
    this.state.subscription.stop();
  }

  render() {
    var dataAvailable = true;
    if(this.props.incidentType_data == undefined) {
      dataAvailable = false;      
    }
    return (<div>
    {dataAvailable ? <form name="incidentTypeForm" onSubmit={this.handleSubmit.bind(this)} >
            Name: <input type="text" ref="textName" placeholder="Name"/><br/>
            Description: <textarea ref="textAreaDescription" placeholder="Description"/><br/>
            <input width="50%" type="submit" value="Update"/>
          </form> : null}
          {dataAvailable ? this.renderIncidentTypes() : null}
    
    </div>);
  }
};

// class sdf extends Component {
//   handleSubmit(event) {
//     event.preventDefault();
 
//     // Find the text field via the React ref
//     const name = ReactDOM.findDOMNode(this.refs.textName).value.trim();
//     const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
    
//     Meteor.call('incidentType.insert', name, description);     
//     alert("Incident type has been updated!");
//     // Clear form
//     // ReactDOM.findDOMNode(this.refs.).value = '';
//     // ReactDOM.findDOMNode(this.refs.textLocation).value = '';
//     // ReactDOM.findDOMNode(this.refs.textAreaDescription).value = '';
//   }

//   renderIncidentTypes() {
//     return this.props.incidentType_data.map((incidentType_data) => (
//       <IncidentType key={incidentType_data._id} incidentType={incidentType_data} />
//     ));
//   }
  
//   render() {
    
//   }
// }

// Category.propTypes = {
//   incidentType_data: PropTypes.array.isRequired,
// };

export default createContainer(({params}) => {
  // Meteor.subscribe('incidentType');
  const incidentType_data = IncidentType_db.find({}).fetch();
  return {        
         incidentType_data,
       };
}, Category);