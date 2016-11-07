import '../imports/api/report.js';
import '../imports/api/userData.js';
import '../imports/api/server/publications.js';
import '../imports/api/cdShelter.js';
import '../imports/api/methods.js';
import {CDShelter_db} from '../imports/api/cdShelter.js';
import '../imports/api/incidentType.js';
import {Meteor} from 'meteor/meteor';
// Meteor.setInterval(function() {
//     console.log("INSIDE INTERVAL")
// }, 2000);

function Get(Url) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", Url, false);
    xhr.send(null);
    return xhr.responseText;
}


var CDSUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=4ee17930-4780-403b-b6d4-b963c7bb1c09&q=CD+Shelter"
var data = JSON.parse(Get(CDSUrl));

Meteor.call('cdShelter.remove');
for (var i = 0;  i < data.result.total; i++) {
    var name = data.result.records[i].name;
    var address = data.result.records[i].address;
    var zip = data.result.records[i].postal_code;
    Meteor.call('cdShelter.insert', name, address, zip);
};