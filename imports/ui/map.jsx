import React from 'react'
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';



App = React.createClass({
  render() {
    return <MyTestMap />;
  }
});

MyTestMap = React.createClass({
  mixins: [ReactMeteorData],
  componentDidMount() {
    GoogleMaps.load();
  },
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  },
  _mapOptions() {
    return {
      center: new google.maps.LatLng(-37.8136, 144.9631),
      zoom: 8
    };
  },
  render() {
    if (this.data.loaded)
      return <GoogleMap name="mymap" options={this.data.mapOptions} />;

    return <div></div>;
  }
});

GoogleMap = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, function(map) {
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  },
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    } 
  },
  textFunction() {
    document.getElementById('map-container').style.visibility = "hidden";
  },
  render() {
    return (<div className="map-container">
      {this.textFunction()}
      </div>);
  }
});

if (Meteor.isClient) {
  Meteor.startup(function() {
  	render(<App />, document.getElementById('root'));
    // return React.render(<App />, document.getElementById('root'));
  });
}
export default React.createClass({
  render() {
    return <div id="map-container"></div>
  }
})

