import {Meteor} from 'meteor/meteor'
import {Reports_db} from '../report.js'
import {UserData_db} from '../userData.js'
// import {Users_db} from '../user.js'

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reports', function reportsPublication() {
    return Reports_db.find();
  });

  Meteor.publish('userData', function userDataPublication() {
    return UserData_db.find();
  });
  // Meteor.publish('users', function usersPublication() {
  //   return Users_db.find();
  // });

//   Meteor.publish("userData", function () {
//   if (this.userId) {
//     return Meteor.users.find({_id: this.userId},
//                              {fields: {'other': 1, 'things': 1}});
//   } else {
//     this.ready();
//   }
// });
}