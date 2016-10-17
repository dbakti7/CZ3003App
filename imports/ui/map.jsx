import React from 'react'
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import reactMixin from 'react-mixin';
import { TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';
import {ReactMeteorData, createContainer} from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import {IncidentType_db} from '../api/incidentType.js';
//React ES6 version

class MyTestMap extends React.Component {
   constructor() {
      super();
      const reportSubscription = Meteor.subscribe('reports', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && incidentTypeSubscription.ready()
        });
        
      }.bind(this)});

      const incidentTypeSubscription = Meteor.subscribe('incidentType', {onReady: function() {
        this.setState({
          ready : reportSubscription.ready() && incidentTypeSubscription.ready()
        })
      }.bind(this)})
      
      this.state = {
        ready : reportSubscription.ready() && incidentTypeSubscription.ready(),
      }
    }

  componentDidMount() {
    GoogleMaps.load({
      key: 'AIzaSyAv9ob20h8bWZxSS_Hvxv9OwkYyjW7SMOo',
      libraries: 'places'
    });
  };
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      reports: Reports_db.find({}).fetch(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  };
  _mapOptions() {
    return {
       center: new google.maps.LatLng(1.352083,103.819836),

      zoom: 12
    };
  };

  render() {
    if (this.data.loaded && this.state.ready) {
      
      return (
              <GoogleMap name="mymap" options={this.data.mapOptions} reports = {this.data.reports}/>
             
        );
    }

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
    
    var markerlist = []
    for(var i =0;i<this.props.reports.length;++i) {
      var temp = []
      temp.push(this.props.reports[i].lat)
      temp.push(this.props.reports[i].long)
      incidentTypeName = IncidentType_db.find({_id: this.props.reports[i].incidentType_id}).fetch()[0].name;
      temp.push(incidentTypeName)
      temp.push(this.props.reports[i].title)
      temp.push(this.props.reports[i].location)
      temp.push('https://www.google.com.sg/')
      markerlist.push(temp)
    }
    console.log(markerlist)
    // var markerlist = [
    // [1.352083, 103.819836,'Fire','Bishan Fire Station','114 Windsor Park Rd, Singapore 574178','https://www.google.com.sg/'],//dummylink
    // [1.347582, 103.680699,'Tornado','Singapore Civil Defence Forces','Lee Wee Nam Library','https://www.google.com.sg/'],
    // [1.297051,103.776402,'Flood','Singapore Civil Defence Forces','National University of Singapore','https://www.google.com.sg/']];
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
    var i;
    var arrayofMarkers =[];
    infowindow = new google.maps.InfoWindow({
content: "holding..."
});
    for(i = 0; i<markerlist.length; i++){
      var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">'+ markerlist[i][4] +'</h1>'+
            '<div id="bodyContent">'+
            '<p> Accident :'+ markerlist[i][2] +'</p>'+
            '<p> Handle By:'+ markerlist[i][3]+ '</p>'+
            '<a href="' +markerlist[i][5]+ '" target ="_blank"> Detail here </a>'+
            '</div>'+
            '</div>';
      
      var x = Math.floor((Math.random()*3)+1);
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][0],markerlist[i][1]),
          map: map.instance,
          animation: google.maps.Animation.DROP,
          icon: icons[markerlist[i][2]].icon,
          title: markerlist[i][2],
          detail: contentString,
        });
      arrayofMarkers.push(marker);
      arrayofMarkers[i].addListener('click', function() {
        var marker = this;
          infowindow.setContent(marker.detail);
          infowindow.open(map, marker);
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
  	render(<MyTestMap />, document.getElementById('root'));
  });
}
export default React.createClass({
  render() {
    return <div id="map-container"></div>
  }
})