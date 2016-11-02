import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router'


export default class UserInstance extends Component {
  deleteUser() {
    Meteor.users.remove(this.props.user._id);
  }
  render() {
    return (
      <tbody>
        <tr> 
          <td><li></li></td>
          <td>
            <Link to = {`/user/${this.props.user._id}/0`} activeClassName="active">{this.props.user.username}</Link>
          </td>
          <td>
            <button className="delete" onClick={this.deleteUser.bind(this)}>Delete User</button>
          </td>
        </tr>
      </tbody>
    );
  }
}
 
UserInstance.propTypes = {
  user: PropTypes.object.isRequired,
};