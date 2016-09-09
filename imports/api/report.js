import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';

export const Reports_db = new Mongo.Collection('reports');
