import React from 'react'
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import reactMixin from 'react-mixin';
import { TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';
import {ReactMeteorData, createContainer} from 'meteor/react-meteor-data';
//React ES6 version
class App extends React.Component {
  
  render() {
    return <MyTestMap />;
  }
}

class MyTestMap extends React.Component {
  // handleSubmit(event){
  //   event.preventDefault();
    
  //   const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

  //   markerlist.insert({
  //     text,
  //     createdAt: new Date(),
  //   });
  // }
  componentDidMount() {
    GoogleMaps.load({
      key: 'AIzaSyAv9ob20h8bWZxSS_Hvxv9OwkYyjW7SMOo',
      libraries: 'places'
    });
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

      //     center : [
      // [-33.890542 , 151.274856,4]],
      zoom: 12
    };
  };
  // renderCoors(){
  //   return this.props.coors.map((coor)=>
  //     (<maps2 coor={coor} />));
  // }
  render() {
    if (this.data.loaded)
      return (
              <GoogleMap name="mymap" options={this.data.mapOptions} />
             
        );

    return <div></div>;
  }
}

// MyTestMap.propTypes ={
//     coors: PropTypes.array.isRequired,
//   };
//   export default createContainer(()=>{
//     return {
//       coors: Coors.find({}).fetch(),
//     };
//   }, MyTestMap);
  reactMixin(MyTestMap.prototype, ReactMeteorData);

class GoogleMap extends React.Component {

 
  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    var markerlist = [
    [1.352083, 103.819836,'Fire'],
    [1.347582, 103.680699,'Tornado'],
    [1.297051,103.776402,'Flood']];
    // var markerlist = [
    // [1.352083, 103.819836,'Fire','Bishan Fire Station','114 Windsor Park Rd, Singapore 574178'],
    // [1.347582, 103.680699,'Tornado','Singapore Civil Defence Forces','Lee Wee Nam Library'],
    // [1.297051,103.776402,'Flood','Singapore Civil Defence Forces','National University of Singapore']];
    var icons = {
      Fire: {//fire
        icon: {
        url: 'http://www.ifssgroup.com/wp-content/uploads/2016/01/fire-icon-287x300.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)},
      },
      Flood: {//flood
        icon: {
        url: 'http://www.covervillemedia.com/statewidesolutions/wp-content/uploads/2015/06/flood-icon.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)},
      },
      Earthquake: {//earthquake
        icon: {
        url: 'http://www.tinepal.org/tmp-content/uploads/2015/04/main_offering_service_icon_remodel_earthquake.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)},
      },
      Tornado: {//earthquake
        icon: {
        url: 'https://emergency.unl.edu/images/icons-master-101116_03.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)},
      }
    }
    GoogleMaps.ready(this.props.name, function(map) {
      // var marker = new google.maps.Marker({
      //   position: map.options.center,
      //   map: map.instance
    //   // });
    // var i,marker;
    var i;
    for(i = 0; i<markerlist.length; i++){
      // var contentString = '<div id="content">'+
      //       '<div id="siteNotice">'+
      //       '</div>'+
      //       '<h3 id="firstHeading" class="firstHeading">'+ markerlist[i][4] +'</h1>'+
      //       '<div id="bodyContent">'+
      //       '<p> Accident :'+ markerlist[i][2] +'</p>'+
      //       '<p> Handle By:'+ markerlist[i][3]+
      //       '</div>'+
      //       '</div>';

      // var infowindow= new google.maps.InfoWindow({
      //   content: contentString
      // });
      var x = Math.floor((Math.random()*3)+1);
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][0],markerlist[i][1]),
          map: map.instance,
          animation: google.maps.Animation.DROP,
          icon: icons[markerlist[i][2]].icon,
          title: markerlist[i][2],

        });
      // marker.addListener('click', function() {
      //     infowindow.open(map, marker);
      //   });

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
