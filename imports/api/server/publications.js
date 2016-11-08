import {Meteor} from 'meteor/meteor'
import {Reports_db} from '../report.js'
import {UserData_db} from '../userData.js'
import {IncidentType_db} from '../incidentType.js'
import {Email} from 'meteor/email'
// import {Users_db} from '../user.js'

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('reports', function reportsPublication() {
    return Reports_db.find();
  });

  Meteor.publish('userData', function userDataPublication() {
    return UserData_db.find();
  });

  Meteor.publish('incidentType', function incidentTypePublication() {
    return IncidentType_db.find();
  });

  Meteor.publish('userAux', function userAuxPublication() {
    return Meteor.users.find();
  });
  // dian
  // process.env.MAIL_URL = "smtp://postmaster@sandboxd9773ce618c64e03a7a974c15c968833.mailgun.org:f0be7502a761fb69eb9695f6a73d1878@smtp.mailgun.org:587";
  
  // pentium
  process.env.MAIL_URL = "smtp://postmaster@sandboxdb0e5714e9e0402b87f76488f3af21d9.mailgun.org:86b2eb48691bec1cd679f76bc58069a4@smtp.mailgun.org:587";
     
     Meteor.methods({
  sendEmail: function (to, subject, text) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    // don’t allow sending email unless the user is logged in
    // if (!Meteor.user())
    //   throw new Meteor.Error(403, "not logged in");

    // and here is where you can throttle the number of emails this user
    // is allowed to send per day

    Email.send({
      to: to,
      from: "sample@sample.com", //Meteor.user().emails[0].address,
      subject: subject,
      html: text
    });
  }
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