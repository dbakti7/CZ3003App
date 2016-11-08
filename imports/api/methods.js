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
 
 
// access token page: EAACEdEose0cBAKZBGe1MZBBITNhaUkEZCHrDO26WkRmxrYMIK3iRkl5BeQ121JbO60MlJ6tm2qFcFc1joJjqDyPgSvlMisluJnxTyVTzE5WdJWDLZBWZCdQPc0gmCnlZCWw8snQFKKX97qvBLKiZBl5gHa1aZCxuJ0DWoEvxT9ZCzZCBbEv5TiIBQI
// access token user: EAAFd7VBDCW8BALEhRl0ke94mPKKkivs2ZCQqT3LRH691aLIDIi3zblDOfUt5ZCY6QxSv8QePlr8L87wmqTtdcJdx5GqhYbzrxZBtr58R7J7rpYFTGgyZBWWsbnXSTtaVbjIwHOpZAqXuJZCDnJ7RyXlL1NURxVZAhsZD
// App ID: 384748811913583
// App Secret: fc7f9815b4bed0987a0a5ae2013b5ff3
 
Meteor.methods({

  //database methods for CD shelter
  'cdShelter.insert'(name, address, zip, lat, lng) {
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
    CDShelter_db.remove({});
  },

    // database methods for report object
  'reports.insert'(title, reportedBy, description, incidentType_id, locationName, lat, long, status, handledBy, handledTime) {
    check(title, String);
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
     Reports_db.remove(reportId);
   },
   'reports.update'(reportId, newTitle, newDescription, newIncidentType_id, newLocationName, newLat, newLong, newStatus, newHandledBy, newHandledTime) {
     Reports_db.update(reportId, {$set: {title: newTitle, description: newDescription,
       incidentType_id: newIncidentType_id, locationName: newLocationName, lat: newLat, long:newLong, status:newStatus, handledBy: newHandledBy, handledTime: newHandledTime}});
   },

   'reports.getByType'(t) {
     var result = Meteor.call('incidentType.findByType', t)
      var result1 = Meteor.call('reports.find', result)
        return result1
   },

   'reports.find'(id) {
      return Reports_db.find({incidentType_id: id}).fetch()
   },
   // aux methods
   'userAux.find'(userId) {
     return Meteor.users.find(userId).fetch();
   },
 
   'userAux.findByEmail'(email) {
     return Meteor.users.find(UserData_db.find({email: email}).fetch()[0].originalUserId).fetch();
   },
 
   'userAux.setPassword'(userId, password) {
     Accounts.setPassword(userId, password);
   },

   'userAux.addUser'(userName, password) {
      newUserId = Meteor.users.insert({
          username: userName,
    });
      Accounts.setPassword(newUserId, password);
      return newUserId;
    },
 
   //atabase methods for user object
   'userData.remove'(userId) {
       Meteor.users.remove(userId);
       UserData_db.remove({originalUserId: userId});
   },

   'userData.getAgencies'() {
     var filter = "Agency"
     return UserData_db.find({type: filter}).fetch()
   },
 
   'userData.update'(userId, newFullName, newEmail, newType, newAgencyName, newPhone, newRegion, newLat, newLng) {
     if(UserData_db.find({originalUserId: userId}).count() == 0) {
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
      UserData_db.update({originalUserId: userId}, {$set: {fullName: newFullName, email: newEmail, type: newType, agencyName: newAgencyName, phone: newPhone, region:newRegion, lat:newLat, lng:newLng}});
     }
   },

   'userData.checkType'(userId) {
     user = UserData_db.find({originalUserId:userId}).fetch()
     if(user.length > 0) {
       if(!user[0].type)
        return "NoType"
       else
        return user[0].type;
     }
     else
      return "undkhkjh";
   },



   // database methods for category object
   'incidentType.insert'(name, description) {
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
     IncidentType_db.remove(incidentTypeId);
   },
   'incidentType.update'(incidentTypeId, newName, newDescription) {
     IncidentType_db.update(incidentTypeId, {$set: {name: newName, description: newDescription}});
   },
   'incidentType.addSubscriber'(incidentType_id, userId, type, status) {
    //  if(status == 0) {
      if(type == "SMS")
        IncidentType_db.update(incidentType_id, {$addToSet: {smsSubscribers: userId}})
      else if(type == "EMAIL")
        IncidentType_db.update(incidentType_id, {$addToSet: {emailSubscribers: userId}})
    //  }
    //  else {
    //    if(type == "SMS") {
    //      IncidentType_db.update(incidentType_id, {$pull: {smsSubscribers: userId}})
    //    }
    //    else if(type == "EMAIL") {
    //     IncidentType_db.update(incidentType_id, {$pull: {emailSubscribers: userId}})
    //    }
    //  }
   },

  //  'incidentType.checkSubscriber'(incidentType_id, userId, type) {
  //    if(type == "SMS") {
  //       if(IncidentType_db.find(incidentType_id, {smsSubscribers: {$in: userID}}))
  //         return true
  //       else {
  //         return false
  //       }
  //    }
  //  },

  'incidentType.find'(id) {
     return IncidentType_db.find(id).fetch()[0]

   },
   
   'incidentType.findByType'(type) {
     return IncidentType_db.find({name: type}).fetch()[0]._id
   },
  'postTweet': function (text) {
        if(Meteor.user())
          T.post('statuses/update', { status: text }, function(err,data,response) {
            console.log(data)
          });
        return true;
    },
  'setRole': function(userId, role) {
    Roles.setUserRoles( userId, role);
  },
  'sendSMS': function(text,number){
    c.Messages.send({text: text, phones:number }, function(err, res){
    console.log('Messages.send()', err, res);
  });

  },
  'postToFacebook': function(text, link) {
    var wallPost = {
      message: text,
      privacy: {value: "EVERYONE"},
      // message: "We do not remember days, we remember moments",
      // caption: 'This is my wall post example',
      link: link
    };
    if(Meteor.user()) {
      graph.setAccessToken("EAAFd7VBDCW8BALEhRl0ke94mPKKkivs2ZCQqT3LRH691aLIDIi3zblDOfUt5ZCY6QxSv8QePlr8L87wmqTtdcJdx5GqhYbzrxZBtr58R7J7rpYFTGgyZBWWsbnXSTtaVbjIwHOpZAqXuJZCDnJ7RyXlL1NURxVZAhsZD");
      graph.post('/feed',wallPost,function(err,result) {
        console.log(result);
      });
    }
    else {
      return false;
    }
  },
  'getAllShelter'() {
    return CDShelter_db.find({}).fetch()
  },
  'getNearestShelter': function(lat, lng) {
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
    // 0 = central 
    // 1 = east
    // 2 = north
    // 3 = north-east
    // 4 = west
    var center = [{
        lat:1.291667,
        lng:103.85,
      }, {
        lat:1.349592,
        lng:103.956789,
      }, {
        lat:1.436269,
        lng:103.786706,
      }, {
        lat:1.405333,
        lng:103.866278,
      }, {
        lat:1.328883,
        lng:103.739947,
      },];
    var min = 100000000;
    var choosen = -1;
    for (i = 0; i < center.length; i++){
      var latDiff = lat - center[i].lat;
      var lngDiff = lng - center[i].lng;
      var dist = Math.sqrt(latDiff*latDiff+lngDiff*lngDiff);
      if(dist<min){
        min = dist;
        choosen = i;
      }
    }
    return choosen;
  },
});
