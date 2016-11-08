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
    counter = {"Fire":{"Active":0, "Handled":0, "Resolved":0}, "Gas Leak":{"Active":0, "Handled":0, "Resolved":0}}
    email = "<p style='color:#414141;'>Dear Mr Prime Minister, <br/><br/><br/>"+
            "The following is the latest development on the current incidents in Singapore.<br/><br/></p>"+
            "<div>"+
            "<h2 style='color:#056571;'>Summary</h2>"+
            "<table style='width:700px; font-family:roboto, sans-serif; color:#414141;'>"+
            "<tr>"+
            "<th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='20%'>Category</th>"+
            "<th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff; 'width='15%'>Active</th>"+
            "<th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='15%'>Handled</th>"+
            "<th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='15%'>Resolved</th></tr>"
    incidents = "<div>"
    for(i = 0;i<incidentTypes.length;++i) {
        var reports =Meteor.call('reports.getByType', incidentTypes[i])
        incidents = incidents + "<h2 style='color:#056571;'>" + incidentTypes[i] + "</h2>"
        incidents = incidents + "<table style='width:700px; font-family:roboto, sans-serif; color:#414141;'><tr><th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='20%'>Title</th><th  style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff; 'width='50%'>Location</th><th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='15%'>Status</th><th style='text-align: left; background-color: #056571; font-weight:bold; color:#ffffff;' width='15%'>Handled By</th></tr>"
        for(j=0;j<reports.length;++j) {
            counter[incidentTypes[i]][reports[j].status] += 1
            incidents = incidents + "<tr><td>" + reports[j].title + "</td><td>" + reports[j].locationName + "</td><td>" + reports[j].status + "</td>"
            if(reports[j].status != "Active")
                incidents = incidents + "<td>" + reports[j].handledBy + "</td>"
            else
                incidents = incidents + "<td></td>"
            incidents = incidents + "</tr>" 
        }
        incidents = incidents + "</table>"
        email = email + "<tr><td>" + incidentTypes[i] + "</td><td>" + counter[incidentTypes[i]]["Active"] + "</td><td>" + counter[incidentTypes[i]]["Handled"] + "</td><td>" + counter[incidentTypes[i]]["Resolved"] + "</td></tr>"
    }
    email = email + "</div>"
    incidents = incidents + "</div>"

    incidents = incidents + "<br/><p style='color:#414141;'>We hope the information we provided could help you monitor the status of incidents and therefore make informed decisions accordingly.<br/></p>"+
            "<p style='color:#414141;'><br/>That is the end of our half-hourly report summary.</p>"+
            "<p style='color:#414141;'>Should you need further information for any purposes, you may navigate to our website, cacadcmssingapore.scalingo.io<br/></p>"+
            "<p style='color:#414141;'><br/>Thank you very much.<br/><br/>Best regards,<br/>CMS Singapore"
    // console.log(incidents)

    // Meteor.call('sendEmail', "dbakti1605@gmail.com", "PM Update", email + incidents);
    Meteor.call('sendEmail', "jm.joshua.martin@gmail.com", "PM Update", email + incidents);
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