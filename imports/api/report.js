import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';
export const Reports_db = new Mongo.Collection('reports');
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reports', function reportsPublication() {
    return Reports_db.find();
  });
}
 
Meteor.methods({
  'reports.insert'(text) {
    check(text, String);
    Reports_db.insert({
       text,
       createdAt: new Date(),
     });
   },});