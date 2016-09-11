import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {UserData_db} from './userData.js';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
Meteor.methods({
    // database methods for report object
  'reports.insert'(title, location, description) {
    check(title, String);
    Reports_db.insert({
       title,
       location,
       description,
       createdAt: new Date(),
     });
   },
   'reports.remove'(reportId) {
     Reports_db.remove(reportId);
   },
   'reports.update'(reportId, newTitle, newLocation, newDescription) {
     Reports_db.update(reportId, {$set: {title: newTitle, location: newLocation, description: newDescription}});
   },

   //atabase methods for user object
   'userData.remove'(userId) {
       UserData_db.remove(userId);
   },

   'userData.update'(userId, newFullName) {
     if(UserData_db.find({originalUserId: userId}).count() == 0) {
        UserData_db.insert({
          originalUserId: userId,
          fullName : newFullName,
          createdAt: new Date(),
       })
     }
     else {
      UserData_db.update({originalUserId: userId}, {$set: {fullName: newFullName}});
     }
   },


   // database methods for category object
  });