import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {Users_db} from './user.js';
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

   // database methods for user object
   'users.insert'(userName, fullName) {
       Users_db.insert({
           userName,
           fullName,
           createdAt: new Date(),
       })
   },

   'users.remove'(userId) {
       Users_db.remove(userId);
   },

   'users.update'(userId, newUserName, newFullName) {
     Users_db.update(userId, {$set: {userName: newUserName, fullName: newFullName}});
   },


   // database methods for category object
  });