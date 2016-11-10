import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';

// To represent a collection in MongoDB to save the list of civil defence shelters in Singapore.
export const CDShelter_db = new Mongo.Collection('cdshelter');
