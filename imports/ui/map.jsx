import React from 'react'
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import reactMixin from 'react-mixin';
import { TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';
import {ReactMeteorData} from 'meteor/react-meteor-data';

//React ES6 version
class App extends React.Component {
  render() {
    return <MyTestMap />;
  }
}

class MyTestMap extends React.Component {
  componentDidMount() {
    GoogleMaps.load();
  };
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  };
  _mapOptions() {
    return {
       center: new google.maps.LatLng(1.352083,103.819836),
      //// zoom: 12
      //     center : [
      // [-33.890542 , 151.274856,4]],
      zoom: 2
    };
  };
  render() {
    if (this.data.loaded)
      return (
              <GoogleMap name="mymap" options={this.data.mapOptions} />
        );

    return <div></div>;
  }
}


  reactMixin(MyTestMap.prototype, ReactMeteorData);

class GoogleMap extends React.Component {

 
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });
    var markerlist = [[1.352083, 103.819836],[-33.80010128657071, 151.28747820854187]];
    GoogleMaps.ready(this.props.name, function(map) {
      // var marker = new google.maps.Marker({
      //   position: map.options.center,
      //   map: map.instance
    //   // });
    // var i,marker;
    var i;
    for(i = 0; i<markerlist.length; i++){
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][0],markerlist[i][1]),
          map: map.instance
        });
      };
    });
  };
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    } 
  };
  textFunction() {
    document.getElementById('map-container').style.visibility = "hidden";
  };
  render() {
    return (<div className="map-container">
      {this.textFunction()}
      </div>);
  };
 
}
 GoogleMap.propTypes  ={
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
  };

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

// React.CreateClass version
// App = React.createClass({
//   render() {
//     return <MyTestMap />;
//   }
// });

// MyTestMap = React.createClass({
//   mixins: [ReactMeteorData],
//   componentDidMount() {
//     GoogleMaps.load();
//   },
//   getMeteorData() {
//     return {
//       loaded: GoogleMaps.loaded(),
//       mapOptions: GoogleMaps.loaded() && this._mapOptions()
//     };
//   },
//   _mapOptions() {
//     return {
//       center: new google.maps.LatLng(-37.8136, 144.9631),
//       zoom: 8
//     };
//   },
//   render() {
//     if (this.data.loaded)
//       return <GoogleMap name="mymap" options={this.data.mapOptions} />;

//     return <div></div>;
//   }
// });

// GoogleMap = React.createClass({
//   propTypes: {
//     name: React.PropTypes.string.isRequired,
//     options: React.PropTypes.object.isRequired
//   },
//   componentDidMount() {
//     GoogleMaps.create({
//       name: this.props.name,
//       element: ReactDOM.findDOMNode(this),
//       options: this.props.options
//     });

//     GoogleMaps.ready(this.props.name, function(map) {
//       var marker = new google.maps.Marker({
//         position: map.options.center,
//         map: map.instance
//       });
//     });
//   },
//   componentWillUnmount() {
//     if (GoogleMaps.maps[this.props.name]) {
//       google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
//       delete GoogleMaps.maps[this.props.name];
//     } 
//   },
//   textFunction() {
//     document.getElementById('map-container').style.visibility = "hidden";
//   },
//   render() {
//     return (<div className="map-container">
//       {this.textFunction()}
//       </div>);
//   }
// });
