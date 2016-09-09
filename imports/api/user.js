import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check';

export const Users_db = new Mongo.Collection('users');
