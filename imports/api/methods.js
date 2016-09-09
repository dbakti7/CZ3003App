import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';
Meteor.methods({
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
  });