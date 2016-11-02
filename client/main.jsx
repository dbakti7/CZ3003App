import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';


import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Home from '../imports/ui/home.jsx'; // home page
import User from '../imports/ui/user.jsx'; // user profile page, for create, edit and view
import User_New from '../imports/ui/user_new.jsx'; // user profile page, for create, edit and view
import Map from '../imports/ui/map.jsx'; // map view
import Category_Edit from '../imports/ui/category_edit.jsx'; // to list out type of crisis, to subscribe
import Category_View from '../imports/ui/category_view.jsx'; // to list out type of crisis, to subscribe
import Report_Edit from '../imports/ui/reports_edit.jsx'; // crisis report page, for create, edit and view
import Report_View from '../imports/ui/reports_view.jsx'; // crisis report page, for create, edit and view
import ForgotPassword from '../imports/ui/ForgotPassword.jsx'; // crisis report page, for create, edit and view
import ResetPassword from '../imports/ui/ResetPassword.jsx'; // crisis report page, for create, edit and view
import UsersView from '../imports/ui/users_view.jsx';
import '../imports/startup/accounts-config.js'; // for account configuration

Meteor.startup(() => {
  render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}/> 
    <Route path="/user/:user_id/:edit" component={User}/>
    <Route path="/user/new" component={User_New}/>
    <Route path="/users/view" component={UsersView}/>
    <Route path="/map" component={Map}/>
    <Route path="/category/:incidentType_id/:edit" component={Category_Edit}/>
    <Route path="/category/view" component={Category_View}/>
    <Route path="/report/:report_id/:edit" component={Report_Edit}/>
    <Route path="/reports/view" component={Report_View}/>
    <Route path="/forgot_password" component={ForgotPassword}/>
    <Route path="/reset_password/:user_id" component={ResetPassword}/>
  </Router>
), document.getElementById('container'));

});

