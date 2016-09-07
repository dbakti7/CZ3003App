import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
    this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click #button'(event, instance) {
    // TAMBAH SKALI
    instance.counter.set(instance.counter.get() + 1);
    },
  'click #buttonMinus'(event, instance) {
    // KURANGIN
    instance.counter.set(instance.counter.get() - 1);
    },
    'click #buttonReset'(event, instance) {
    // ENOLIN/RESET
    instance.counter.set(0);
    },
});
