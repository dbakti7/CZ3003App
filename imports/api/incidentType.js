import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';

// To represent a collection in MongoDB to save the list of incident types (categories).
export const IncidentType_db = new Mongo.Collection('incidentType');
