import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';

// To represent a collection in MongoDB to save the list of reported incidents.
export const Reports_db = new Mongo.Collection('reports');
