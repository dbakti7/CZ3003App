import React, { Component, PropTypes, componentWillReceiveProps, componentDidMount } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import { Meteor } from 'meteor/meteor';
import {IndexLink, Link } from 'react-router'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {IncidentType_db} from '../api/incidentType.js';
import {UserData_db} from '../api/userData.js';
import {browserHistory } from 'react-router'

// This component is used to render page to edit reports
class Reports_Edit extends TrackerReact(React.Component) {
    constructor() {
        super();
        var lat;
        var lng;
        var locationName;

        // Subscribe to necessary database tables / collections
        const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
            this.setState({
                ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
            });
        }.bind(this)});

        const userSubscription = Meteor.subscribe('userData',{onReady: function() {
            this.setState({
                ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
            });
        }.bind(this)});

        const subscription = Meteor.subscribe('incidentType');

        const userAuxSubscription = Meteor.subscribe('userAux', {onReady: function() {
            this.setState({
                ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
            })
        }.bind(this)})

        const incidentTypeSubscription = Meteor.subscribe('incidentType', {onReady: function() {
            this.setState({
                ready : reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready() && incidentTypeSubscription.ready()
            })
        }.bind(this)})

        // React tracker state to manage callbak when subscription is ready
        this.state = {
            ready: reportSubscription.ready() && userSubscription.ready() && userAuxSubscription.ready(),
            reportSubscription: reportSubscription,
            userSubscription: userSubscription,
            subscription: subscription,
            userAuxSubscription: userAuxSubscription,
            incidentTypeSubscription: incidentTypeSubscription,
        }
    }

    // Handle form submission
    handleSubmit(event) {
        event.preventDefault();

        Bert.alert({
            type: 'success',
            style: 'fixed-top',
            title: 'Reported!',
            icon: 'fa-check'
        });

        // Find the text field via the React ref
        const title = ReactDOM.findDOMNode(this.refs.textTitle).value.trim();
        const description = ReactDOM.findDOMNode(this.refs.textAreaDescription).value.trim();
        const incidentType_id = ReactDOM.findDOMNode(this.refs.incidentType).value.trim();
        const status = ReactDOM.findDOMNode(this.refs.status).value.trim();
        var handledBy = Meteor.user().username;

        if(this.props.report_item.length > 0) {
            var reportArray = this.props.report_item;
            if(status == "Resolved")
                resolvedTime = new Date()
            Meteor.call('reports.update', reportArray[0]._id, title, description, incidentType_id, locationName, lat, lng, status, handledBy, reportArray[0].handledTime);
        }
        else {
            var empty = ""
            // Insert into database      
            Meteor.call('reports.insert', title, Meteor.userId(), description, incidentType_id, locationName, lat, lng, status, empty, new Date("January 1, 2015 00:00:00"));

            // Get the nearest civil defence shelter of a location
            Meteor.call('getNearestShelter', lat, lng, function(err,shelterList) {
                // Get the incident type (category) name
                Meteor.call('incidentType.find', incidentType_id, function(err, result) {
                    
                    // Facebook post template
                    var facebookTemplate =      "Warning! A case of "+ result.name + " has been reported in " + locationName +
                                                ". Please evacuate the location immediately and act accordingly. You can go to the nearest shelter at " + shelterList.address + 
                                                " Click on the following link to get further information on the latest development of incidents! \"cacadcmssingapore.scalingo.io/map\""
                    
                    // Twitter post template
                    var twitTemplate =          "A case of " + result.name + " has been reported in " + locationName + 
                                                ". Please evacuate immediately and act accordingly."
                    
                    // Email template
                    var emailTemplate =         "<div>Warning! A case of " + result.name + "has been reported in " + locationName +
                                                ". Please evacuate the location immediately and act accordingly." + 
                                                "You can go to the nearest shelter at " + shelterList.address + 
                                                "Click on the following link to get further information on the latest development of incidents! cacadcmssingapore.scalingo.io/map</div>"
                    
                    // Email template for agency
                    var emailTemplateAgency =   "<div>Warning! A case of " + result.name + "has been reported in " + locationName +
                                                ". Please handle the situation!."+
                                                "Click on the following link to get further information on the latest development of incidents! cacadcmssingapore.scalingo.io/map</div>"
                    
                    // SMS template agency
                    var smsTemplateAgency =     "A case of " + result.name + " has been reported in " + locationName + ". Please handle the situation!"
                    
                    // Post to facebook
                    Meteor.call('postToFacebook', title + ":" + facebookTemplate, "cacadcmssingapore.scalingo.io/map")
                    
                    // Post to twitter
                    Meteor.call('postTweet', title + ":" + twitTemplate);
                    
                    // Get the region of a location
                    Meteor.call('getRegion', lat, lng, function(err, regionIndex) {
                    
                        for(i=0;i<result.emailSubscribers.length;++i) {
                            if(!result.emailSubscribers[i])
                                continue;
                            subUser = UserData_db.find({originalUserId: result.emailSubscribers[i]}).fetch()[0]
                            // Send email notification to subscribers
                            if(!subUser)
                                continue;
                            Meteor.call('getRegion', subUser.lat, subUser.lng, function(err, res) {
                                if(subUser.type == "Public" && subUser.email != "")
                                    Meteor.call('sendEmail', subUser.email, title, emailTemplate);
                                else if(subUser.type == "Agency" && subUser.email != "" && res == regionIndex)
                                    Meteor.call('sendEmail', subUser.email, title, emailTemplateAgency);
                            })
                        }


                        for(i=0;i<result.smsSubscribers.length;++i) {
                            if(!result.smsSubscribers[i])
                                continue;
                            subUser = UserData_db.find({originalUserId: result.smsSubscribers[i]}).fetch()[0]
                            // Send SMS notification to subscribers
                            if(!subUser)
                                continue;
                            Meteor.call('getRegion', subUser.lat, subUser.lng, function(err, res) {
                                if(subUser.type == "Public" && subUser.phone != "")
                                    Meteor.call("sendSMS", twitTemplate, subUser.phone)
                                else if(subUser.type == "Agency" && subUser.phone != "" && res == regionIndex)
                                    Meteor.call("sendSMS", smsTemplateAgency, subUser.phone)
                            })
                        }
                    })
                })
            })
        }
        browserHistory.push('/reports/view')
    }

    // Get reports details
    renderReportItem() {
        if(this.props.report_item.length > 0) {
            var report = this.props.report_item[0];      
            var textRB = ReactDOM.findDOMNode(this.refs.textReportedBy);
            if(this.state.ready) {
                var RBU = null;
                Meteor.call('userAux.find', this.props.report_item[0].reportedBy, function(error, result) {
                RBU = result[0];
                textRB.value = RBU.username;
                });
            }
            lat = report.lat;
            lng = report.long;
            locationName = report.locationName;
            ReactDOM.findDOMNode(this.refs.textTitle).value = report.title;
            ReactDOM.findDOMNode(this.refs.textLocation).value = report.locationName;
            ReactDOM.findDOMNode(this.refs.textAreaDescription).value = report.description;
            ReactDOM.findDOMNode(this.refs.incidentType).value = report.incidentType_id;
            ReactDOM.findDOMNode(this.refs.status).value = report.status;
            if(Roles.userIsInRole( Meteor.userId(), ['Admin', 'Agency'] ))
                ReactDOM.findDOMNode(this.refs.status).disabled = false;
            else
                ReactDOM.findDOMNode(this.refs.status).disabled = true;
        }
        else {
            var textRB = ReactDOM.findDOMNode(this.refs.textReportedBy);
            var RBU = null;

            Meteor.call('userAux.find', Meteor.userId(), function(error, result) {
            RBU = result[0];
            textRB.value = RBU.username;
            });
        }
    }

    // Auto complete for location field
    autocomplete() {
        if (GoogleMaps.loaded()) {
            var input = document.getElementById("location");
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                locationName = place.name;
                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();
            })
        }
    }

    // Stop subscription
    componentWillUnmount() {
        this.state.reportSubscription.stop();
        this.state.userSubscription.stop();
        this.state.subscription.stop();
        this.state.userAuxSubscription.stop();
        this.state.incidentTypeSubscription.stop();
    }

    // Page rendering
    render() {
        var currentUser = this.props.currentUser;
        var reportedByUser = this.props.reportedByUser;
        var report_item = this.props.report_item;

        if(Roles.userIsInRole(Meteor.userId(), ['Admin', 'Operator'])) {
            return (<div>
                        <h2>Incident Page</h2> 
                        <form name="reportCase" onSubmit={this.handleSubmit.bind(this)}>
                            <fieldset id="reportCaseFieldSet">
                                <table width="100%" border="0">
                                    <tr>
                                        <td width="15%">Title:</td> 
                                        <td><input type="text" size="40" ref="textTitle" placeholder="Type to add new tasks" required/><br/></td>
                                    </tr>
                                    <tr>
                                        <td>Reported By:</td>
                                        <td><input type="text" size="40" ref="textReportedBy" disabled = "true"/><br/></td>
                                    </tr>
                                    <tr>
                                        <td>Location:</td> 
                                        <td><input type="text" size="40" id="location" ref="textLocation" placeholder="Location" onFocus={this.autocomplete} required/><br/></td>
                                    </tr>
                                    <tr>
                                        <td>Description:</td> 
                                        <td><textarea cols="40" rows="4" ref="textAreaDescription" placeholder="Description" required/><br/></td>
                                    </tr>
                                    <tr>
                                        <td>Incident Type:</td>
                                        <td>
                                            <select ref="incidentType" defaultValue="" required>
                                                <option value="" disabled>Incident Type</option>
                                                {
                                                    this.props.incidentTypeList.map(function(incidentType) {
                                                        return <option key={incidentType._id}
                                                        value={incidentType._id}>{incidentType.name}</option>;
                                                    })
                                                }
                                            </select><br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Status:</td>
                                        <td>{(report_item[0]==null) ? 
                                                (<select ref="status" defaultValue="" required>
                                                    <option value="Active">Active</option>
                                                    <option value="Handled">Handled</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>) 
                                            :
                                            (
                                                (report_item[0].status == "Active") ?
                                                (<select ref="status" defaultValue="" required>
                                                    <option value="Active">Active</option>
                                                    <option value="Handled">Handled</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>)
                                                :
                                                (
                                                    (report_item[0].status == "Handled") ?
                                                        (<select ref="status" defaultValue="" required>
                                                            <option value="Handled">Handled</option>
                                                            <option value="Resolved">Resolved</option>
                                                        </select>)
                                                    :
                                                    (<select ref="status" defaultValue="" required>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>)
                                                )
                                            )}<br/>
                                        </td>
                                    </tr>
                                    {
                                        (Roles.userIsInRole(Meteor.userId(), ['Admin', 'Agency', 'Operator'])) ? 
                                            (<tr>
                                                <td colspan="2"><input width="50%"type="submit" value="Report" id="submitButton"/></td>
                                            </tr>)
                                        : null
                                    }
                                </table>
                            </fieldset>
                        </form>
                    {this.state.ready ? this.renderReportItem() : null}
                    <br/>
                    <Link to =  "/reports/view" activeClassName="active">← Back to list of incidents</Link>
                </div>
            )
        }
        else {
            return (<div>
                        <h2>Report Page</h2> 
                        <form name="reportCase" onSubmit={this.handleSubmit.bind(this)}>
                        <fieldset id="reportCaseFieldSet">
                        <table width="100%" border="0">
                        <tr>
                            <td width="15%">Title:</td> 
                            <td><input type="text" size="40" ref="textTitle" placeholder="Type to add new tasks" disabled="true"/><br/></td>
                        </tr>
                        <tr>
                            <td>Reported By:</td>
                            <td><input type="text" size="40" ref="textReportedBy" disabled = "true"/><br/></td>
                        </tr>
                        <tr>
                            <td>Location:</td> 
                            <td><input type="text" size="40" id="location" ref="textLocation" placeholder="Location" onFocus={this.autocomplete} disabled="true"/><br/></td>
                        </tr>
                        <tr>
                            <td>Description:</td> 
                            <td><textarea cols="40" rows="4" ref="textAreaDescription" placeholder="Description" disabled="true"/><br/></td>
                        </tr>
                        <tr>
                            <td>Incident Type:</td>
                            <td>
                                <select ref="incidentType" defaultValue="" disabled="true">
                                    <option value="" disabled>Incident Type</option>
                                    {
                                        this.props.incidentTypeList.map(function(incidentType) {
                                            return <option key={incidentType._id}
                                            value={incidentType._id}>{incidentType.name}</option>;
                                        })
                                    }
                                </select><br/>
                            </td>
                        </tr>
                        {(Roles.userIsInRole(Meteor.userId(), ['Admin', 'Agency'])) ? 
                            (<tr>
                                <td>Status:</td>
                                <td>
                                    {(report_item[0]==null) ?
                                        (<select ref="status" defaultValue="" required>
                                            <option value="Active">Active</option>
                                            <option value="Handled">Handled</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>)
                                    :
                                        (
                                            (report_item[0].status == "Active") ?
                                                (<select ref="status" defaultValue="" required>
                                                    <option value="Active">Active</option>
                                                    <option value="Handled">Handled</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>)
                                                :
                                                    (
                                                        (report_item[0].status == "Handled") ? 
                                                            (<select ref="status" defaultValue="" required>
                                                                <option value="Handled">Handled</option>
                                                                <option value="Resolved">Resolved</option>
                                                            </select>)
                                                        :
                                                            (<select ref="status" defaultValue="" required>
                                                                <option value="Resolved">Resolved</option>
                                                            </select>
                                                            )
                                                    )
                                        )
                                    } <br/>
                                </td>
                            </tr>
                        )
                    :
                        (
                            <tr>
                                <td>Status:</td>
                                <td>
                                    <select ref="status" defaultValue="" disabled="true">
                                        <option value="Active">Active</option>
                                        <option value="Handled">Handled</option>
                                        <option value="Resolved">Resolved</option>
                                    </select><br/>
                                </td>
                            </tr>
                        )
                    }

                    {(Roles.userIsInRole(Meteor.userId(), ['Admin', 'Agency', 'Operator'])) ? 
                        (<tr>
                            <td colspan="2"><input width="50%"type="submit" value="Report" id="submitButton"/></td>
                        </tr>)
                    : null
                    }
                </table>
            </fieldset>
        </form>
        {this.state.ready ? this.renderReportItem() : null}
        <br/>
        <Link to =  "/reports/view" activeClassName="active">← Back to list of incidents</Link>
        </div>)
        }
    }
}

Reports_Edit.propTypes = {
    reports: PropTypes.array.isRequired,
};


// Return report components to be rendered
export default createContainer(({params}) => {
    const new_report = params.report_id == 0
    const report_item = Reports_db.find({_id: params.report_id}).fetch()
    const reportedByUser = report_item.length > 0 ? Meteor.users.find({_id: report_item[0].reportedBy}).fetch() : []
    const user_list = Meteor.users.find({}).fetch();
    const currentUser = Meteor.user();
    const incidentTypeList = IncidentType_db.find({}).fetch();
    return {
        new_report,
        report_item,
        reportedByUser,
        user_list,
        currentUser,
        incidentTypeList,
    };
}, Reports_Edit);