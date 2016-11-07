import React from 'react'
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import reactMixin from 'react-mixin';
import { TrackerReactMixin} from 'meteor/ultimatejs:tracker-react';
import {ReactMeteorData, createContainer} from 'meteor/react-meteor-data';
import {Reports_db} from '../api/report.js';
import {IncidentType_db} from '../api/incidentType.js';
import Time from 'react-time'
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
      var PSIMarkers = null;
      var WeatherMarkers = null;
      var urlPSI = "http://api.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref=781CF461BB6606ADC767F3B357E848ED47F0A16C2198F816"
      var urlWeather = "http://api.nea.gov.sg/api/WebAPI/?dataset=24hrs_forecast&keyref=781CF461BB6606ADC767F3B357E848ED47F0A16C2198F816"

      var xmlHttp = new XMLHttpRequest();
      var self = this;
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            xmlDoc = new DOMParser().parseFromString(xmlHttp.responseText, 'text/xml');
            regions = xmlDoc.getElementsByTagName("region");
            self.setState({
              PSIReadings: regions
            }) 
          }
      }
      xmlHttp.open("GET", urlPSI, true); // true for asynchronous 
      xmlHttp.send(null);

      var xmlHttpWeather = new XMLHttpRequest();
      xmlHttpWeather.onreadystatechange = function() { 
          if (xmlHttpWeather.readyState == 4 && xmlHttpWeather.status == 200) {
            xmlDoc = new DOMParser().parseFromString(xmlHttpWeather.responseText, 'text/xml');
            weatherNight = xmlDoc.getElementsByTagName("night")
            weatherMorn = xmlDoc.getElementsByTagName("morn")
            weatherAfternoon = xmlDoc.getElementsByTagName("afternoon")
            self.setState({
              weatherReadings: {weatherNight, weatherMorn, weatherAfternoon}
            }) 
          }
      }
      xmlHttpWeather.open("GET", urlWeather, true); // true for asynchronous 
      xmlHttpWeather.send(null);

      this.state = {
        ready : false,
        PSIReadings: null,
        weatherReadings: null,
        PSIToggle: true,
        weatherToggle: true,
      }
       
    }
  
  componentDidMount() {
    mapi = new google.maps.Map(ReactDOM.findDOMNode(this),
        this.props.options);
    PSIMarkers = null;
    WeatherMarkers = null;
    var self = this;
    var PSIControlDiv = document.createElement('div');
    var PSIControl = new this.PSIControl(PSIControlDiv, mapi, self, "PSI");
    var WeatherControlDiv = document.createElement('div');
    var WeatherControl = new this.PSIControl(WeatherControlDiv, mapi, self, "Weather");
    PSIControlDiv.index = 1;
    WeatherControlDiv.index = 1;
    mapi.controls[google.maps.ControlPosition.TOP_CENTER].push(PSIControlDiv);
    mapi.controls[google.maps.ControlPosition.TOP_CENTER].push(WeatherControlDiv);
    this.setState({
          ready : true
        })
  }
    ;
    
    PSIControl(controlDiv, map, self, title) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to show PSI Markers';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = title;
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        if(title == "PSI") {
          controlUI.addEventListener('click', function() {
            self.setState({
                PSIToggle: !self.state.PSIToggle,
              })
          });
        }
        else if(title == "Weather") {
          controlUI.addEventListener('click', function() {
            self.setState({
                weatherToggle: !self.state.weatherToggle,
              })
          });
        }

      }

  renderPSIMarkers() {
    if(PSIMarkers != null) {
      for(i=0;i<PSIMarkers.length;++i) {
        if(this.state.PSIToggle)
          PSIMarkers[i].setMap(mapi);
        else
          PSIMarkers[i].setMap(null);
      }
      return;
    }
    var markerlist = []
    
    regions = this.state.PSIReadings
    for(i=0;i<regions.length;++i) {
      var temp = []
      temp.push(regions[i].getElementsByTagName("id")[0].innerHTML)
      temp.push(regions[i].getElementsByTagName("latitude")[0].innerHTML)
      temp.push(regions[i].getElementsByTagName("longitude")[0].innerHTML)
      var readings = regions[i].getElementsByTagName("reading")
      
      for(j=0;j<readings.length;++j) {
        temp.push(readings[j].getAttribute('value'));
      }
      markerlist.push(temp);
    }
    PSIMarkers = markerlist;
    var arrayofMarkers = []
    var icon = {
        url: 'images/haze.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)}
    for(i = 0; i<markerlist.length; i++){
      //content for each pop ups
      var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">'+ markerlist[i][0] +'</h3>'+
            '<div id="bodyContent">'+
            '<table>'+
              '<tr>' +
                '<td>24-hr PSI</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][1] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>3-hr PSI</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][2] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>1-hr NO2 concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][5] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>24-hrs PM10 concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][6] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>24-hrs PM2.5 concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][7] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>24-hrs SO2 concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][8] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>8-hrs CO concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][9] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>8-hrs O3 concentration</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][10] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>CO sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][11] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>NO2 sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][12] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>O3 sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][13] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>PM10 sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][14] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>PM2.5 sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][15] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>SO2 sub-index</td>'+
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][16] + '</td>' +
              '</tr>' +
            '</table>'+

            '</div>'+
            '</div>';
      //detail of each marker
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][1],markerlist[i][2]),
          map: mapi,
          title: markerlist[i][0],
          icon: icon,
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
    PSIMarkers = arrayofMarkers;
  }


  renderWeatherMarkers() {
    if(WeatherMarkers != null) {
      for(i=0;i<WeatherMarkers.length;++i) {
        if(this.state.weatherToggle)
          WeatherMarkers[i].setMap(mapi);
        else
          WeatherMarkers[i].setMap(null);
      }
      return;
    }
    var markerlist = []
    hour = new Date().getHours()
    if(hour >= 6 && hour <= 12)
      weathers = this.state.weatherReadings["weatherMorn"][0]
    else if(hour > 12 && hour < 18)
      weathers = this.state.weatherReadings["weatherAfternoon"][0]
    else 
      weathers = this.state.weatherReadings["weatherNight"]
    
    for(i=0;i<weathers.length;++i) {
      var temp = []
      temp.push(weathers[i].getElementsByTagName("wxeast")[0].innerHTML)
      temp.push(1.35735)
      temp.push(103.94000)
      markerlist.push(temp)
      temp = []
      temp.push(weathers[i].getElementsByTagName("wxwest")[0].innerHTML)
      temp.push(1.35735)
      temp.push(103.70000)
      markerlist.push(temp)
      temp = []
      temp.push(weathers[i].getElementsByTagName("wxnorth")[0].innerHTML)
      temp.push(1.41803)
      temp.push(103.82000)
      markerlist.push(temp)
      temp = []
      temp.push(weathers[i].getElementsByTagName("wxsouth")[0].innerHTML)
      temp.push(1.29587)
      temp.push(103.82000)
      markerlist.push(temp)
      temp = []
      temp.push(weathers[i].getElementsByTagName("wxcentral")[0].innerHTML)
      temp.push(1.35735)
      temp.push(103.82000)
      markerlist.push(temp)
    }
    
    var weatherList = {'BR': ['haze.png', 'Mist'], 'CL': ['cloudy.png', 'Cloudy'], 'FA': ['sunny.png', 'Fair (Day)'], 
  'FN': ['sunny.png', 'Fair (Night)']}
    var arrayofMarkers = []
    var icon = {
        url: 'images/logo.png',
        scaledSize: new google.maps.Size(20,20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0)}
    for(i = 0; i<markerlist.length; i++){
      //content for each pop ups
      var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="firstHeading">'+
            '<h3>' + weatherList[markerlist[i][0]][1] + '</h3>'
            '</div>';
      //detail of each marker
      icon['url'] = 'images/' + weatherList[markerlist[i][0]][0]
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][1],markerlist[i][2]),
          map: mapi,
          title: markerlist[i][0],
          icon: icon,
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
    WeatherMarkers = arrayofMarkers;
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
      temp.push(this.props.reports[i].locationName)
      temp.push('https://www.google.com.sg/')
      markerlist.push(temp)
    }
    
    incidentList = {'Gas Leak': 'gasleak.png', 'Traffic Accident': 'caracc.png', 'Dengue': 'dengue.png', 
  'MRT Breakdown': 'mrtbd.png', 'Fire': 'fire.png'}
    //marker icon details
    var icon = {
        url: 'images/logo.png',
        scaledSize: new google.maps.Size(30,30),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,0),
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
            '<table>'+
              '<tr>'+
                '<td>Accident</td>'+ 
                '<td>:</td>'+
                '<td class="mapContent">' + markerlist[i][2] + '</td>'+
              '</tr>' +
              '<tr>' +
                '<td>Handle By</td>' +
                '<td>:</td>' +
                '<td class="mapContent">'+ markerlist[i][3]+ '</td>'+
              '</tr>'+
            '</table><br/>'+
            '<a href="' +markerlist[i][5]+ '" target ="_blank"> <i>Detail here</i> </a>'+
            '</div>'+
            '</div>';
      //detail of each marker
      icon['url'] = 'images/' + incidentList[markerlist[i][2]]
      var  marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerlist[i][0],markerlist[i][1]),
          map: mapi,
          icon: icon,
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
      {this.state.PSIReadings != null ? (this.state.PSIToggle ? this.renderPSIMarkers(): this.renderPSIMarkers()) : null}
      {this.state.weatherReadings != null ? (this.state.weatherToggle ? this.renderWeatherMarkers(): this.renderWeatherMarkers()) : null}
      </div>);
  };
 
}
// {this.state.PSIReadings != null ? this.renderPSIMarkers() : null}
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