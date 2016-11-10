import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// import components
import Home from '../imports/ui/home.jsx'; // home page
import User from '../imports/ui/user.jsx'; // user profile page, for create, edit and view
import Map from '../imports/ui/map.jsx'; // map page, to show Singapore map and all the incidents
import Category_Edit from '../imports/ui/category_edit.jsx'; // edit page for incident categories
import Category_View from '../imports/ui/category_view.jsx'; // to list out incident categories
import Report_Edit from '../imports/ui/reports_edit.jsx'; // edit page for reporting an incident
import Report_View from '../imports/ui/reports_view.jsx'; // to list all the incidents
import ForgotPassword from '../imports/ui/ForgotPassword.jsx'; // forgot password page
import ResetPassword from '../imports/ui/ResetPassword.jsx'; // reset password page
import UsersView from '../imports/ui/users_view.jsx'; // to list all users
import '../imports/startup/accounts-config.js'; // for account configuration

// configure the URLs with react-router
Meteor.startup(() => {
    render((
        <Router history={browserHistory}>
        <Route path="/" component={Home}/> 
        <Route path="/user/:user_id/:edit" component={User}/>
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
