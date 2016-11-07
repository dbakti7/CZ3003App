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
  //initialized data when the map is call
  componentDidMount() {
    //api key
    GoogleMaps.load({
      key: 'AIzaSyAv9ob20h8bWZxSS_Hvxv9OwkYyjW7SMOo',
      libraries: 'places'
    });
  };
  //get all incident details from mongoDB
  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      reports: Reports_db.find({}).fetch(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions(),

    };
  };
  //focus center of map and detail zoom of the map
  _mapOptions() {
    return {
       center: new google.maps.LatLng(1.352083,103.819836),

      zoom: 12
    };
  };
  //render the map
  render() {
    if (this.data.loaded && this.state.ready) {
      return (
              //call the GoogleMap and pass the data
              <GoogleMap name="mymap" options={this.data.mapOptions} reports = {Reports_db.find({}).fetch()}/>
             
        );
    }

    return <div></div>;
  }
}


reactMixin(MyTestMap.prototype, ReactMeteorData);

class GoogleMap extends React.Component {
  constructor() {
      super();
      var mapi;
      var PSIMarkers;
      var urlPSI = "http://api.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref=781CF461BB6606ADC767F3B357E848ED47F0A16C2198F816"

      var xmlHttp = new XMLHttpRequest();
      var self = this;
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            xmlDoc = new DOMParser().parseFromString(xmlHttp.responseText, 'text/xml');
            regions = xmlDoc.getElementsByTagName("region");
            console.log(regions)
            self.setState({
              PSIReadings: regions
            })
            
          }
              
      }
      xmlHttp.open("GET", urlPSI, true); // true for asynchronous 
      xmlHttp.send(null);


      this.state = {
        ready : false,
        PSIReadings: null,
      }
       
    }
  
  componentDidMount() {
    mapi = new google.maps.Map(ReactDOM.findDOMNode(this),
        this.props.options);
    
    this.setState({
          ready : true
        })
  }
    ;
    
  renderPSIMarkers() {
    var markerlist = []
    console.log("INSIDE PSI MARKER")
    console.log(this.state.PSIReadings)
    regions = this.state.PSIReadings
    for(i=0;i<regions.length;++i) {
      var temp = []
      temp.push(regions[i].getElementsByTagName("id")[0].innerHTML)
      temp.push(regions[i].getElementsByTagName("latitude")[0].innerHTML)
      temp.push(regions[i].getElementsByTagName("longitude")[0].innerHTML)
      var readings = regions[i].getElementsByTagName("reading")
      console.log(readings);
      for(j=0;j<readings.length;++j) {
        temp.push(readings[j].getAttribute('value'));
      }
      markerlist.push(temp);
      console.log(temp)
    }

    var arrayofMarkers = []
    for(i = 0; i<markerlist.length; i++){
      //content for each pop ups
      var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">'+ markerlist[i][0] +'</h1>'+
            '<div id="bodyContent">'+
            '<p> 24-hr PSI :'+ markerlist[i][3] +'</p>'+
            '<p> 3-hr PSI:'+ markerlist[i][4]+ '</p>'+
            '<p> 1-hr NO2 concentration:'+ markerlist[i][5]+ '</p>'+
            '<p> 24-hrs PM10 concentration:'+ markerlist[i][6]+ '</p>'+
            '<p> 24-hrs PM2.5 concentration:'+ markerlist[i][7]+ '</p>'+
            '<p> 24-hrs SO2 concentration:'+ markerlist[i][8]+ '</p>'+
            '<p> 8-hrs CO concentration:'+ markerlist[i][9]+ '</p>'+
            '<p> 8-hrs O3 concentration:'+ markerlist[i][10]+ '</p>'+
            '<p> CO sub-index:'+ markerlist[i][11]+ '</p>'+
            '<p> NO2 sub-index:'+ markerlist[i][12]+ '</p>'+
            '<p> O3 sub-index:'+ markerlist[i][13]+ '</p>'+
            '<p> PM10 sub-index:'+ markerlist[i][14]+ '</p>'+
            '<p> PM2.5 sub-index:'+ markerlist[i][15]+ '</p>'+
            '<p> SO2 sub-index:'+ markerlist[i][16]+ '</p>'+
            '</div>'+
            '</div>';
      //detail of each marker
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][1],markerlist[i][2]),
          map: mapi,
          title: markerlist[i][0],
          detail: contentString,
        });
      arrayofMarkers.push(marker);
      //link the pop ups with the marker 
      arrayofMarkers[i].addListener('click', function() {
        var marker = this;
          infowindow.setContent(marker.detail);
          infowindow.open(mapi, marker);
        });
    }
  }

    renderMarkers() {
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
    
    //marker icon details
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
    
    
    var i;
    var arrayofMarkers =[];

    //initialize infoWindow for pop ups
    infowindow = new google.maps.InfoWindow({
      content: "holding..."
      });

    //render all the marker to the map
    for(i = 0; i<markerlist.length; i++){
      //content for each pop ups
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
      //detail of each marker
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][0],markerlist[i][1]),
          map: mapi,
          icon: icons[markerlist[i][2]].icon,
          title: markerlist[i][2],
          detail: contentString,
        });
      arrayofMarkers.push(marker);
      //link the pop ups with the marker 
      arrayofMarkers[i].addListener('click', function() {
        var marker = this;
          infowindow.setContent(marker.detail);
          infowindow.open(mapi, marker);
        });

      };

    }//);
  // };
  //
  componentWillUnmount() {
    if (GoogleMaps.maps[this.props.name]) {
      google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
      delete GoogleMaps.maps[this.props.name];
    } 
  };
  textFunction() {
    document.getElementById('map-container').style.visibility = "hidden";
    document.getElementById('root').style.height = "100%";
  };
  render() {
    return (<div className="map-container">
      {this.textFunction()}
      {this.state.ready ? this.renderMarkers(): null}
      {this.state.PSIReadings != null ? this.renderPSIMarkers() : null}
      </div>);
  };
 
}

//data type for googleMaps
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