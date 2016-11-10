import {Meteor} from 'meteor/meteor'
import {Reports_db} from '../report.js'
import {UserData_db} from '../userData.js'
import {IncidentType_db} from '../incidentType.js'
import {Email} from 'meteor/email'
// import {Users_db} from '../user.js'

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('reports', function reportsPublication() {
        /*
        To register a publication named 'reports' on the server.
        So that the client can subscribe to all the data from the 'reports' publication
        */
        return Reports_db.find();
    });

    Meteor.publish('userData', function userDataPublication() {
        /*
        To register a publication named 'userData' on the server.
        So that the client can subscribe to all the data from the 'reports' publication
        */
        return UserData_db.find();
    });

    Meteor.publish('incidentType', function incidentTypePublication() {
        /*
        To register a publication named 'incidentType' on the server.
        So that the client can subscribe to all the data from the 'reports' publication
        */
        return IncidentType_db.find();
    });

    Meteor.publish('userAux', function userAuxPublication() {
        /*
        To register a publication named 'userAux' on the server.
        So that the client can subscribe to all the data from the 'reports' publication
        */
        return Meteor.users.find();
    });

    process.env.MAIL_URL = "smtp://postmaster@sandboxdb0e5714e9e0402b87f76488f3af21d9.mailgun.org:86b2eb48691bec1cd679f76bc58069a4@smtp.mailgun.org:587";

    Meteor.methods({
        sendEmail: function (to, subject, text) {
            
            this.unblock(); // Let other method calls from the same client start running, without waiting for the email sending to complete.
            
            Email.send({
                // Function to send email
                to: to,
                from: "sample@sample.com",
                subject: subject,
                html: text
            });
        }
    });
}