import '../imports/api/report.js';
import '../imports/api/userData.js';
import '../imports/api/server/publications.js';
import '../imports/api/cdShelter.js';
import '../imports/api/methods.js';
import '../imports/api/incidentType.js';
import {Meteor} from 'meteor/meteor';
Meteor.setInterval(function() {
    console.log("INSIDE INTERVAL")
    incidentTypes = ["Fire", "Gas Leak"]
    incidents = "<div>"
    for(i = 0;i<incidentTypes.length;++i) {
        var reports =Meteor.call('reports.getByType', incidentTypes[i])
        incidents = incidents + "<h2>" + incidentTypes[i] + "</h2>"
        incidents = incidents + "<table><tr><th>Title</th><th>Location></th><th>Status</th><th>Handled By</th></tr>"
        for(j=0;j<reports.length;++j) {
            console.log("INSIDE")
            incidents = incidents + "<tr><td>" + reports[j].title + "</td><td>" + reports[j].locationName + "</td><td>" + reports[j].status + "</td>"
            if(reports[j].status != "Active")
                incidents = incidents + "<td>" + reports[j].handledBy + "</td>"
            else
                incidents = incidents + "<td></td>"
            incidents = incidents + "</tr>" 
        }
        incidents = incidents + "</table>"
    }
    incidents = incidents + "</div>"
    console.log(incidents)
    Meteor.call('sendEmail', "dbakti1605@gmail.com", "PM Update", incidents);
}, 5000);
function GetMinuteDiff(a, b) {
    var diff = a - b;
    return Math.round(((diff % 86400000) % 3600000) / 60000);
}

    

function Get(Url) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", Url, false);
    xhr.send(null);
    return xhr.responseText;
}

try {

    var CDSUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=4ee17930-4780-403b-b6d4-b963c7bb1c09&q=CD+Shelter"
    var data = JSON.parse(Get(CDSUrl));
    var latitude = [1.3499993, 1.376443, 1.3812742, 1.3504867, 1.3592214, 1.4306003, 1.3741089, 1.3533537, 1.348784, 1.366819, 1.3640057, 1.2749238, 1.3424396, 1.3498125, 1.3048947, 1.3121862, 1.3374034, 1.3865405, 1.378325];
    var longitude = [103.745541, 103.768624, 103.7496508, 103.7232469, 103.7474799, 103.8364139, 103.8898865, 103.9524818, 103.9335453, 103.8387085, 103.8515014, 103.8056762, 103.6902363, 103.8484432, 103.9074335, 103.7869661, 103.8435483, 103.769641, 103.9403968];
    
    Meteor.call('cdShelter.remove');
    for (var i = 0;  i < data.result.total; i++) {
        var name = data.result.records[i].name;
        var address = data.result.records[i].address;
        var zip = data.result.records[i].postal_code;
        var lat = latitude[i];
        var lng = longitude[i];
        Meteor.call('cdShelter.insert', name, address, zip, lat, lng);
    };

} catch(err) {
    console.log(err);
}