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

// Get Google Map API
class GoMap extends React.Component {
	constructor() {
		super();

		// subscribe to necessary database tables / collections
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
			reportSubscription: reportSubscription,
			incidentTypeSubscription: incidentTypeSubscription
		}
	}
	
	//initialized data when the map is called
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

reactMixin(GoMap.prototype, ReactMeteorData);

// Google Map Rendering
class GoogleMap extends React.Component {
	constructor() {
		super();
		var mapi;
		var PSIMarkers = null;
		var WeatherMarkers = null;
		var ShelterMarkers = null;
		var ReportedMarkers = null;
		var self = this;

		// get weather conditions for 5 regions in Singapore
		var urlWeather = "http://api.nea.gov.sg/api/WebAPI/?dataset=24hrs_forecast&keyref=781CF461BB6606ADC767F3B357E848ED47F0A16C2198F816"
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
		xmlHttpWeather.open("GET", urlWeather, true); 
		xmlHttpWeather.send(null);

		// get PSI readings for 5 regions in Singapore
		var urlPSI = "http://api.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref=781CF461BB6606ADC767F3B357E848ED47F0A16C2198F816"
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            xmlDoc = new DOMParser().parseFromString(xmlHttp.responseText, 'text/xml');
            regions = xmlDoc.getElementsByTagName("region");
            self.setState({
				PSIReadings: regions
			})
			}
		}
		xmlHttp.open("GET", urlPSI, true); 
		xmlHttp.send(null);
		
		// Get all Civil Defense Shelters locations
		Meteor.call('getAllShelter', function(error, result) {
			self.setState({
				shelters: result
			})
		})
		
		// react tracker state to manage callback when subscription is ready
		this.state = {
			ready : false,
			PSIReadings: null,
			weatherReadings: null,
			shelters: null,
			PSIToggle: true,
			weatherToggle: true,
			shelterToggle: true,
			FireToggle: true,
			DengueToggle: true,
			TrafficToggle: true,
			GasToggle: true,
			MRTToggle: true,
		}
	}
	
	// initialize all toggle buttons
	componentDidMount() {
		mapi = new google.maps.Map(ReactDOM.findDOMNode(this),this.props.options);
		PSIMarkers = null;
		WeatherMarkers = null;
		ShelterMarkers = null;
		ReportedMarkers = null;
		var self = this;
    	var PSIControlDiv = document.createElement('div');
		var PSIControl = new this.PSIControl(PSIControlDiv, mapi, self, "PSI");
		var WeatherControlDiv = document.createElement('div');
		var WeatherControl = new this.PSIControl(WeatherControlDiv, mapi, self, "Weather");
		var ShelterControlDiv = document.createElement('div');
		var ShelterControl = new this.PSIControl(ShelterControlDiv, mapi, self, "Shelter");
		var FireControlDiv = document.createElement('div');
		var FireControl = new this.PSIControl(FireControlDiv, mapi, self, "Fire");
		var DengueControlDiv = document.createElement('div');
		var DengueControl = new this.PSIControl(DengueControlDiv, mapi, self, "Dengue");
		var TrafficControlDiv = document.createElement('div');
		var TrafficControl = new this.PSIControl(TrafficControlDiv, mapi, self, "Traffic");
		var GasControlDiv = document.createElement('div');
		var GasControl = new this.PSIControl(GasControlDiv, mapi, self, "Gas");
		var MRTControlDiv = document.createElement('div');
		var MRTControl = new this.PSIControl(GasControlDiv, mapi, self, "MRT");
		PSIControlDiv.index = 1;
		WeatherControlDiv.index = 1;
		ShelterControlDiv.index = 1;
		FireControlDiv.index = 1;
		DengueControlDiv.index = 1;
		TrafficControlDiv.index = 1;
		GasControlDiv.index = 1;
		MRTControlDiv.index = 1;

		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(PSIControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(WeatherControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(ShelterControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(DengueControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(TrafficControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(FireControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(GasControlDiv);
		mapi.controls[google.maps.ControlPosition.RIGHT_CENTER].push(MRTControlDiv);
		this.setState({
			ready : true
		})
	};
    
	
	PSIControl(controlDiv, map, self, title) {
		// Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '3px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to show markers';
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

        // Setup the click event listeners for toggle buttons of each type of marker
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
		else if(title == "Shelter") {
			controlUI.addEventListener('click', function() {
				self.setState({
					shelterToggle: !self.state.shelterToggle,
				})
			});
        }
        else if(title == "Fire") {
			controlUI.addEventListener('click', function() {
				self.setState({
					FireToggle: !self.state.FireToggle,
				})
			});
		}
        else if(title == "Dengue") {
			controlUI.addEventListener('click', function() {
				self.setState({
					DengueToggle: !self.state.DengueToggle,
				})
			});
		}
        else if(title == "Traffic") {
			controlUI.addEventListener('click', function() {
				self.setState({
					TrafficToggle: !self.state.TrafficToggle,
				})
			});
		}
        else if(title == "Gas") {
			controlUI.addEventListener('click', function() {
				self.setState({
					GasToggle: !self.state.GasToggle,
				})
			});
		}
        else if(title == "MRT") {
			controlUI.addEventListener('click', function() {
				self.setState({
					MRTToggle: !self.state.MRTToggle,
				})
			});
		}
	}
	
	// render markers for PSI information
	renderPSIMarkers() {
		// show/hide markers if already exist
		if(PSIMarkers != null) {
			for(i=0;i<PSIMarkers.length;++i) {
				if(this.state.PSIToggle)
					PSIMarkers[i].setMap(mapi);
				else
					PSIMarkers[i].setMap(null);
			}
			return;
		}

		// render markers for the first time
		var markerlist = []
		regions = this.state.PSIReadings

		// parse the reading from API request
    	for(i=0;i<regions.length;++i) {
			var temp = []
      		var regionName = regions[i].getElementsByTagName("id")[0].innerHTML
      		if(regionName == 'rNO') 
        		temp.push("North Region")
      		else if(regionName == 'rSO')
        		temp.push("South Region")
      		else if(regionName == 'rCE')
        		temp.push("Central Region")
      		else if(regionName == 'rWE')
        		temp.push("West Region")
      		else if(regionName == 'rEA')
        		temp.push("East Region")
				temp.push(regions[i].getElementsByTagName("latitude")[0].innerHTML)
				temp.push(regions[i].getElementsByTagName("longitude")[0].innerHTML)
      			var readings = regions[i].getElementsByTagName("reading")
				
				for(j=0;j<readings.length;++j) {
					temp.push(readings[j].getAttribute('value'));
				}
			markerlist.push(temp);
		}

		// setup the markers
		PSIMarkers = markerlist;
		var arrayofMarkers = []
		var icon = {
			url: 'images/haze.png',
			scaledSize: new google.maps.Size(30,30),
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
						'<td class="mapContent">' + markerlist[i][3] + '</td>' +
					'</tr>' +
					'<tr>' +
                		'<td>3-hr PSI</td>'+
                		'<td>:</td>'+
                		'<td class="mapContent">' + markerlist[i][4] + '</td>' +
              		'</tr>' +
              		'<tr>' +
                		'<td>24-hrs PM2.5 concentration</td>'+
						'<td>:</td>'+
						'<td class="mapContent">' + markerlist[i][7] + '</td>' +
              		'</tr>' +
              		'<tr>' +
                		'<td>PM2.5 sub-index</td>'+
                		'<td>:</td>'+
                		'<td class="mapContent">' + markerlist[i][14] + '</td>' +
              		'</tr>' +
            		'</table>'+
            		'</div>'+
            		'</div>';
				
				//detail of each marker
				var  marker = new google.maps.Marker({
					position: new google.maps.LatLng(markerlist[i][1],markerlist[i][2]-0.0075),
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
		// assign to global varible to avoid rendering the markers multiple times
		PSIMarkers = arrayofMarkers;
	}
	
	// render the markers for Civil Defense Shelters
	renderShelterMarkers() {
		// show/hide markers if already exist
		if(ShelterMarkers != null) {
			for(i=0;i<ShelterMarkers.length;++i) {
				if(this.state.shelterToggle)
					ShelterMarkers[i].setMap(mapi);
				else
					ShelterMarkers[i].setMap(null);
			}
			return;
		}
		
		// render the markers for the first time
		var markerlist = []
		
		// parse the readings from API request
		shelterList =this.state.shelters
		for(i=0;i<shelterList.length;++i) {
			var temp = []
			temp.push(shelterList[i].name)
			temp.push(shelterList[i].address)
			temp.push(shelterList[i].lat)
			temp.push(shelterList[i].lng)
			markerlist.push(temp)
		}
		var arrayofMarkers = []
		var icon = {
			url: 'images/shelter.png',
			scaledSize: new google.maps.Size(30,30),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0,0)}

		for(i = 0; i<markerlist.length; i++){
			//content for each pop ups
			var contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
            	'<div id="firstHeading">'+
            	'<h3>' + markerlist[i][0] + '</h3>' +
            	'<div id="bodyContent">'+
            	'<table>'+
              	'<tr>' +
                	'<td>Address</td>'+
                	'<td>:</td>'+
                	'<td class="mapContent">' + markerlist[i][1] + '</td>' +
              	'</tr></table>' +
				'<a href=https://www.google.com.sg/maps/place/"' +markerlist[i][1]+ '" target ="_blank"> <i>Go To</i> </a>'+
				'</div></div>';
			
			//detail of each marker
			var  marker = new google.maps.Marker({
				position: new google.maps.LatLng(markerlist[i][2],markerlist[i][3]),
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
		// assign to global varible to avoid rendering the markers multiple times
		ShelterMarkers = arrayofMarkers;
	}

	// render markers for weather condition for each region in Singapore
	renderWeatherMarkers() {
		// show / hide markers if already exist
		if(WeatherMarkers != null) {
			for(i=0;i<WeatherMarkers.length;++i) {
				if(this.state.weatherToggle)
					WeatherMarkers[i].setMap(mapi);
				else
					WeatherMarkers[i].setMap(null);
			}
			return;
		}

		// render the markers for the first time
		var markerlist = []

		hour = new Date().getHours()
		if(hour >= 6 && hour <= 12)
			weathers = this.state.weatherReadings["weatherMorn"][0]
		else if(hour > 12 && hour < 18)
			weathers = this.state.weatherReadings["weatherAfternoon"][0]
		else weathers = this.state.weatherReadings["weatherNight"][0]
		
		// parse readings from API request
		var temp = []
		temp.push(weathers.getElementsByTagName("wxeast")[0].innerHTML)
		temp.push(1.35735)
		temp.push(103.94000)
		markerlist.push(temp)
		temp = []
		temp.push(weathers.getElementsByTagName("wxwest")[0].innerHTML)
		temp.push(1.35735)
		temp.push(103.70000)
		markerlist.push(temp)
		temp = []
		temp.push(weathers.getElementsByTagName("wxnorth")[0].innerHTML)
		temp.push(1.41803)
		temp.push(103.82000)
		markerlist.push(temp)
		temp = []
		temp.push(weathers.getElementsByTagName("wxsouth")[0].innerHTML)
		temp.push(1.29587)
		temp.push(103.82000)
		markerlist.push(temp)
		temp = []
		temp.push(weathers.getElementsByTagName("wxcentral")[0].innerHTML)
		temp.push(1.35735)
		temp.push(103.82000)
		markerlist.push(temp)

		// dictionary to retrieve the icon for each weather type
		var weatherList = {
			'BR': ['haze.png', 'Mist'], 
			'CL': ['cloudy.png', 'Cloudy'], 
			'DR': ['rain.png', 'Drizzle'], 
			'FA': ['sunny.png', 'Fair (Day)'], 
			'FG': ['haze.png', 'Fog'], 
			'FN': ['sunny.png', 'Fair (Night)'], 
			'FW': ['sunny.png', 'Fair and Warm'],
			'HG': ['storm.png', 'Heavy Thundery Showers with Gusty Winds'],
			'HR': ['rain.png', 'Heavy Rain'],
			'HS': ['rain.png', 'Heavy Showers'],
			'HT': ['storm.png', 'Heavy Thundery Showers'], 
			'HZ': ['haze.png', 'Hazy'],
			'LH': ['haze.png', 'Slightly Hazy'],
			'LR': ['rain.png', 'Light Rain'],
			'LS': ['rain.png', 'Light Showers'],
			'OC': ['cloudy.png', 'Overcast'],
			'PC': ['cloudy.png', 'Partly Cloudy (Day)'], 
			'PN': ['cloudy.png', 'Partly Cloudy (Night)'],
			'PS': ['rain.png', 'Passing Showers'],
			'RA': ['rain.png', 'Moderate Rain'],
			'SH': ['rain.png', 'Showers'],
			'SK': ['rain.png', 'Strong Wind, Showers'],
			'SN': ['snowflake.png', 'Snow'],
			'SR': ['rain.png', 'Strong Wing, Rains'],
			'SS': ['snowflake.png', 'Snow Showers'],
			'SU': ['sunny.png', 'Sunny'],
			'SW': ['windy.png', 'Strong Winds'],
			'TL': ['storm.png', 'Thundery Showers'],
			'WC': ['windy.png', 'Windy, Cloudy'], 
			'WD': ['windy.png', 'Windy'], 
			'WF': ['windy.png', 'Windy, Fair'], 
			'WR': ['windy.png', 'Windy, Rain'], 
			'WS': ['windy.png', 'Windy, Showers'], 
		}
  
		// setup the markers		
		var arrayofMarkers = []
		var icon = {
			url: 'images/logo.png',
			scaledSize: new google.maps.Size(30,30),
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
				position: new google.maps.LatLng(markerlist[i][1],markerlist[i][2]+0.00075),
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
		// assign to global varible to avoid rendering the markers multiple times
		WeatherMarkers = arrayofMarkers;
	}

	// render markers for reported incidents
	renderMarkers() {
		// clear all previous markers to avoid duplicates
		if(ReportedMarkers != null) {
			for(i = 0;i<ReportedMarkers.length;++i)
				ReportedMarkers[i].setMap(null);
		}
		
		// retrieved on/off toggle from react tracker for each type of incident category
		var toggles = {"Fire":this.state.FireToggle, "Gas Leak": this.state.GasToggle, "Traffic Accident": this.state.TrafficToggle, "Dengue":this.state.DengueToggle, "MRT Breakdown": this.state.MRTToggle}
		var markerlist = []
		for(var i =0;i<this.props.reports.length;++i) {
			if(this.props.reports[i].status == "Resolved")
				continue;
			var temp = []
			temp.push(this.props.reports[i].lat)
			temp.push(this.props.reports[i].long)
			incidentTypeName = IncidentType_db.find({_id: this.props.reports[i].incidentType_id}).fetch()[0].name;
			temp.push(incidentTypeName)
			temp.push(this.props.reports[i].title)
			temp.push(this.props.reports[i].locationName)
			temp.push('http://cacadcmssingapore.scalingo.io/reports/view')
      		if(this.props.reports[i].status == "Handled")
        		temp.push("Handled by: " + this.props.reports[i].handledBy)
      		else if(this.props.reports[i].status == "Active")
        		temp.push("Active")
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
				'<h3 id="firstHeading" class="firstHeading">'+ markerlist[i][3] +'</h1>'+
				'<div id="bodyContent">'+
				'<table>'+
              	'<tr>'+
                	'<td>Accident</td>'+ 
                	'<td>:</td>'+
                	'<td class="mapContent">' + markerlist[i][2] + '</td>'+
				'</tr>' +
				'<tr>'+
					'<td>Location</td>'+ 
					'<td>:</td>'+
					'<td class="mapContent">' + markerlist[i][4] + '</td>'+
				'</tr>' +
				'<tr>' +
					'<td>Status</td>' +
					'<td>:</td>' +
					'<td class="mapContent">'+ markerlist[i][6]+ '</td>'+
              	'</tr>'+
            	'</table><br/>'+
				'<a href="' +markerlist[i][5]+ '" target ="_blank"> <i>Detail here</i> </a>'+
				'</div>'+
				'</div>';
			
			//detail of each marker
			if(toggles[markerlist[i][2]] == false)
				continue
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
			arrayofMarkers[arrayofMarkers.length-1].addListener('click', function() {
				var marker = this;
				infowindow.setContent(marker.detail);
				infowindow.open(mapi, marker);
			});
		};
		ReportedMarkers = arrayofMarkers;
	}

	// stop listening from Google Map
	componentWillUnmount() {
		if (GoogleMaps.maps[this.props.name]) {
			google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.props.name].instance);
			delete GoogleMaps.maps[this.props.name];
		} 
	};
	
	// show or hide map
	showMap() {
		document.getElementById('map-container').style.visibility = "hidden";
		document.getElementById('root').style.height = "100%";
	};
	
	// render the map, re-render each marker if there is a change on its on/off toggle
	render() {
		return (<div className="map-container">
				{this.showMap()}
				{this.state.ready ? ((this.state.FireToggle || this.state.GasToggle || this.state.TrafficToggle || this.state.DengueToggle || this.state.MRTToggle) ? this.renderMarkers(): this.renderMarkers()) : null}
				{this.state.PSIReadings != null ? (this.state.PSIToggle ? this.renderPSIMarkers(): this.renderPSIMarkers()) : null}
				{this.state.weatherReadings != null ? (this.state.weatherToggle ? this.renderWeatherMarkers(): this.renderWeatherMarkers()) : null}
      			{this.state.shelters != null ? (this.state.shelterToggle ? this.renderShelterMarkers(): this.renderShelterMarkers()) : null}
      			</div>
				);
	};

}

//data type for googleMaps
GoogleMap.propTypes  ={
	name: React.PropTypes.string.isRequired,
	options: React.PropTypes.object.isRequired,
};

// render the map on client side
if (Meteor.isClient) {
	Meteor.startup(function() {
		render(<GoMap />, document.getElementById('root'));
	});
}

// return map-container to contain the map
export default React.createClass({
	render() {
		return <div id="map-container"></div>
	}
})