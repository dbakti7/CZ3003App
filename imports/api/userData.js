import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo'
import { check } from 'meteor/check';

export const UserData_db = new Mongo.Collection('userData');
