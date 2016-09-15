import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';


import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Home from '../imports/ui/home.jsx'; // home page
import User from '../imports/ui/user.jsx'; // user profile page, for create, edit and view
import Map from '../imports/ui/map.jsx'; // map view
import Category from '../imports/ui/category.jsx'; // to list out type of crisis, to subscribe
import Report from '../imports/ui/reports.jsx'; // crisis report page, for create, edit and view
import '../imports/startup/accounts-config.js'; // for account configuration

Meteor.startup(() => {
  render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}/> 
    <Route path="/user/:user_id/:edit" component={User}/>
    <Route path="/map" component={Map}/>
    <Route path="/category" component={Category}/>
    <Route path="/report/:report_id/:edit" component={Report}/>
  </Router>
), document.getElementById('container'));

});

