import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {UserData_db} from './userData.js';
import {IncidentType_db} from './incidentType.js';
import {CDShelter_db} from './cdShelter.js';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import React from 'react'

var Twit = require('twit')
var T = new Twit({
    consumer_key:       '3VpOg3V8wo1zYbHy85lPohsiE',
    consumer_secret:    'G2JNNJlvnReZKMD7FSHVpjdIk1pt2I2rqzBPKZ9j3GXnAmZMbI',
    access_token:       '787981834395131904-rzLdfOM9iySaYv32GBwZxJvs43oiYS6',
    access_token_secret:'a7Pvl4t1gQNmlJBltT6t8XnTS6XLhKmueP0QXV2yw6k2Y',
    timeout_ms:         60*1000,
})

var graph = require('fbgraph')

var TMClient = require('textmagic-rest-client');
var c = new TMClient('kelvinchandra', '6iFrTE7jAyEitElLrVdQAPkmmUEHdB');

Meteor.methods({

    // Database methods for Civil Defence Shelter
    'cdShelter.insert'(name, address, zip, lat, lng) {
        // Method to insert data to community defence shelter collection in MongoDB
        CDShelter_db.insert({
            name,
            address,
            zip,
            lat,
            lng,
            createdAt: new Date(),
        });
    },

    'cdShelter.remove'() {
        // Method to remove all data from the civil defence shelter collection in MongoDB
        CDShelter_db.remove({});
    },

    // Database methods for report object
    'reports.insert'(title, reportedBy, description, incidentType_id, locationName, lat, long, status, handledBy, handledTime) {
        // Method to insert data to report collection in MongoDB
        check(title, String);   // Check whether the title that is to be inserted in the collection is a string
        Reports_db.insert({
            title,
            reportedBy,
            description,
            incidentType_id,
            locationName,
            lat,
            long,
            status,
            handledBy,
            handledTime,
            createdAt: new Date(),
        });
    },

    'reports.remove'(reportId) {
        // Method to remove a report based on reportId
        Reports_db.remove(reportId);
    },

    'reports.update'(reportId, newTitle, newDescription, newIncidentType_id, newLocationName, newLat, newLong, newStatus, newHandledBy, newHandledTime) {
        // Method to update a report record based on reportId
        Reports_db.update(reportId, {$set: {title: newTitle, description: newDescription,
        incidentType_id: newIncidentType_id, locationName: newLocationName, lat: newLat, long:newLong, status:newStatus, handledBy: newHandledBy, handledTime: newHandledTime}});
    },

    'reports.getByType'(t) {
        // Method to get reports based on its incident type (category)
        var result = Meteor.call('incidentType.findByType', t)
        var result1 = Meteor.call('reports.find', result)
        return result1
    },

    'reports.find'(id) {
        // Method to get reports based on its incident type (category)
        return Reports_db.find({incidentType_id: id}).fetch()
    },

    // Database methods for userAux
    'userAux.find'(userId) {
        // Method to get user based on the userId
        return Meteor.users.find(userId).fetch();
    },

    'userAux.findByEmail'(email) {
        // Method to get user based on the email
        return Meteor.users.find(UserData_db.find({email: email}).fetch()[0].originalUserId).fetch();
    },

    'userAux.setPassword'(userId, password) {
        // Method to set password for the user
        Accounts.setPassword(userId, password);
    },

    'userAux.addUser'(userName, password) {
        // Method to add a new user
        newUserId = Meteor.users.insert({
            username: userName,
        });
        Accounts.setPassword(newUserId, password);
        return newUserId;
    },

    //Database methods for user object
    'userData.remove'(userId) {
        // Method to remove the user based on userId
        Meteor.users.remove(userId);
        UserData_db.remove({originalUserId: userId});
    },

    'userData.getAgencies'() {
        // Method to get all user with type = agency
        var filter = "Agency"
        return UserData_db.find({type: filter}).fetch()
    },

    'userData.update'(userId, newFullName, newEmail, newType, newAgencyName, newPhone, newRegion, newLat, newLng) {
        // Method to update user information
        if(UserData_db.find({originalUserId: userId}).count() == 0) {
            // If there is no existing user with the userId
            UserData_db.insert({
                originalUserId: userId,
                fullName : newFullName,
                email: newEmail,
                type: newType,
                agencyName: newAgencyName,
                phone: newPhone,
                region: newRegion,
                lat: newLat,
                lng: newLng,
                createdAt: new Date(),
            })
        }
        else {
            // If there is an existing user with the userId
            UserData_db.update({originalUserId: userId}, {$set: {fullName: newFullName, email: newEmail, type: newType, agencyName: newAgencyName, phone: newPhone, region:newRegion, lat:newLat, lng:newLng}});
        }
    },

    'userData.checkType'(userId) {
        // Method to check which type the user belongs to
        user = UserData_db.find({originalUserId:userId}).fetch()
        if(user.length > 0) {
            if(!user[0].type)
                return "NoType"
            else
                return user[0].type;
        }
        else
            return "N.A.";
    },

    // Database methods for category object
    'incidentType.insert'(name, description) {
        // Method to insert data to incidentType collection in MongoDB
        check(name, String);
        IncidentType_db.insert({
            name,
            description,
            emailSubscribers: [],
            smsSubscribers: [],
            createdAt: new Date(),
        });
    },

    'incidentType.remove'(incidentTypeId) {
        // Method to remove an incident type (category) based on its id
        IncidentType_db.remove(incidentTypeId);
    },

    'incidentType.update'(incidentTypeId, newName, newDescription) {
        // Method to update the details of an incident type (category)
        IncidentType_db.update(incidentTypeId, {$set: {name: newName, description: newDescription}});
    },

    'incidentType.addSubscriber'(incidentType_id, userId, type, status) {
        // Method to add user as a subscriber for a particular incident type (category)
        if(type == "SMS")
            IncidentType_db.update(incidentType_id, {$addToSet: {smsSubscribers: userId}})
        else if(type == "EMAIL")
            IncidentType_db.update(incidentType_id, {$addToSet: {emailSubscribers: userId}})
    },

    'incidentType.removeSubscriber'(incidentType_id, userId, type){
        // Method to remove user from the subscribers list for a particular incident type (category)
        if(type == "SMS")
            IncidentType_db.update(incidentType_id, {$pull: {smsSubscribers: userId}})   
        else if(type == "EMAIL")
            IncidentType_db.update(incidentType_id, {$pull: {emailSubscribers: userId}})   
    },

    'incidentType.find'(id) {
        // Method to get the incident type (category) based on its id
        return IncidentType_db.find(id).fetch()[0]
    },

    'incidentType.findByType'(type) {
        // Method to get the incident type (category) based on its name
        return IncidentType_db.find({name: type}).fetch()[0]._id
    },

    
    'setRole': function(userId, role) {
        // Method to set the role (admin, operator, agency) to the user
        Roles.setUserRoles( userId, role);
    },

    'postTweet': function (text) {
        // Method to post a tweet to twitter
        if(Meteor.user())
            T.post('statuses/update', { status: text }, function(err,data,response) {});
        return true;
    },

    'sendSMS': function(text,number){
        // Method to send a SMS
        c.Messages.send({text: text, phones:number }, function(err, res){});
    },

    'postToFacebook': function(text, link) {
        // Method to post to facebook
        var wallPost = {
            message: text,
            privacy: {value: "EVERYONE"},
            link: link
        };
        if(Meteor.user()) {
            graph.setAccessToken("EAAFd7VBDCW8BALEhRl0ke94mPKKkivs2ZCQqT3LRH691aLIDIi3zblDOfUt5ZCY6QxSv8QePlr8L87wmqTtdcJdx5GqhYbzrxZBtr58R7J7rpYFTGgyZBWWsbnXSTtaVbjIwHOpZAqXuJZCDnJ7RyXlL1NURxVZAhsZD");
            graph.post('/feed',wallPost,function(err,result) {});
        }
        else {
            return false;
        }
    },

    'getAllShelter'() {
        // Method to get all civil defence shelters in Singapore
        return CDShelter_db.find({}).fetch()
    },

    'getNearestShelter': function(lat, lng) {
        // Method to find the nearest civil defence shelter from a particular location (lat, lng)
        var min = 1000000000;
        var cursor = CDShelter_db.find();
        var result = null;
        cursor.forEach(function(item) { 
            var latDiff = (lat - item.lat);
            var lngDiff = (lng - item.lng);
            var dist = Math.sqrt(latDiff*latDiff*+lngDiff*lngDiff);
            if(dist<min) {
                min = dist
                result = item;
            }
        })
        return result;
    },

    'getRegion': function(lat, lng){
        // Method to determine which region a location (lat, lng) belongs to
        /*
            Convention:
                0 = central 
                1 = east
                2 = north
                3 = north-east
                4 = west
        */
        var center = [
            {lat:1.291667, lng:103.85,}, 
            {lat:1.349592, lng:103.956789,}, 
            {lat:1.436269, lng:103.786706,},
            {lat:1.405333, lng:103.866278,}, 
            {lat:1.328883, lng:103.739947,}
        ];
        var min = 100000000;
        var chosen = -1;
        for (i = 0; i < center.length; i++){
            var latDiff = lat - center[i].lat;
            var lngDiff = lng - center[i].lng;
            var dist = Math.sqrt(latDiff*latDiff+lngDiff*lngDiff);
            if(dist<min){
                min = dist;
                chosen = i;
            }
        }
        return chosen;
    },
});
