import {Meteor} from 'meteor/meteor'
import {Reports_db} from '../report.js'
// import {Users_db} from '../user.js'

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reports', function reportsPublication() {
    return Reports_db.find();
  });

  // Meteor.publish('users', function usersPublication() {
  //   return Users_db.find();
  // });
}