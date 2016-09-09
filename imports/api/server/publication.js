import {Meteor} from 'meteor/meteor'
import {Reports_db} from '../report.js'

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reports', function reportsPublication() {
    return Reports_db.find();
  });
}