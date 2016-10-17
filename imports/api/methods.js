import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {UserData_db} from './userData.js';
import {IncidentType_db} from './incidentType.js';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
Meteor.methods({
    // database methods for report object
  'reports.insert'(title, reportedBy, location, description, incidentType_id, locationName, lat, long) {
    check(title, String);
    Reports_db.insert({
       title,
       reportedBy,
       location,
       description,
       incidentType_id,
       locationName,
       lat,
       long,
       createdAt: new Date(),
     });
   },
   'reports.remove'(reportId) {
     Reports_db.remove(reportId);
   },
   'reports.update'(reportId, newTitle, newLocation, newDescription, newIncidentType_id, newLocationName, newLat, newLong) {
     Reports_db.update(reportId, {$set: {title: newTitle, location: newLocation, description: newDescription, 
       incidentType_id: newIncidentType_id, locationName: newLocationName, lat: newLat, long:newLong}});
   },

   // aux methods
   'userAux.find'(userId) {
     return Meteor.users.find(userId).fetch();
   },

   'userAux.findByEmail'(email) {
     return Meteor.users.find(UserData_db.find({email: email}).fetch()[0].originalUserId).fetch();
   },

   'userAux.setPassword'(userId, password) {
     Accounts.setPassword(userId, password);
   },

   //atabase methods for user object
   'userData.remove'(userId) {
       UserData_db.remove(userId);
   },

   'userData.update'(userId, newFullName, newEmail, newType, newAgencyName) {
     if(UserData_db.find({originalUserId: userId}).count() == 0) {
        UserData_db.insert({
          originalUserId: userId,
          fullName : newFullName,
          email: newEmail,
          type: newType,
          agencyName: newAgencyName,
          createdAt: new Date(),
       })
     }
     else {
      UserData_db.update({originalUserId: userId}, {$set: {fullName: newFullName, email: newEmail, type: newType, agencyName: newAgencyName}});
     }
   },


   // database methods for category object
   'incidentType.insert'(name, description) {
    check(name, String);
    IncidentType_db.insert({
       name,
       description,
       subscribers: [],
       createdAt: new Date(),
     });
   },
   'incidentType.remove'(incidentTypeId) {
     IncidentType_db.remove(incidentTypeId);
   },
   'incidentType.update'(incidentTypeId, newName, newDescription) {
     IncidentType_db.update(incidentTypeId, {$set: {name: newName, description: newDescription}});
   },
   'incidentType.addSubscriber'(incidentType_id, userId) {
     IncidentType_db.update(incidentType_id, {$addToSet: {subscribers: userId}})
   }
  });