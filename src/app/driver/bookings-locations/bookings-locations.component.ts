import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { CommonService } from 'src/app/service/common.service';
import { styles } from './mapstyles';

@Component({
  selector: 'app-bookings-locations',
  templateUrl: './bookings-locations.component.html',
  styleUrls: ['./bookings-locations.component.css']
})
export class BookingsLocationsComponent implements OnInit {
  places: any;
  title = 'google-maps';
  map: google.maps.Map

  constructor() { }

  ngOnInit(): void {
    this.loadGoogleMaps()
    this.getDirections()
    this.places = this.getLocations()
  }

  calculateLocations() {
    const locations = [{ lat: 52.041944, lng: -0.69351 },
      { lat: 52.916763, lng: -1.485883 },
      { lat: 51.411802, lng: -0.095092 },
      { lat: 52.125991, lng: -0.499651 }]
  }

  loadGoogleMaps() {

    const origin = { lat: 52.041944, lng: -0.69351 };
    const stop = {lat: 51.411802, lng: -0.095092}
    const destination = { lat: 52.916763, lng: -1.485883 };

    const loader = new Loader({
      apiKey: 'AIzaSyD7AtzURBENak8Dwda8CdOOqt9mkHQXu9U'
    })

    loader.load().then(() => {
      console.log('loaded gmaps')

      const location = { lat: 52.041944, lng: 	-0.69351 }

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 12,
        styles
      })

    const directionService = new google.maps.DirectionsService();
    const directionDisplay = new google.maps.DirectionsRenderer();

    directionDisplay.setMap(this.map);
    const waypts = [{
      location:   new google.maps.LatLng(stop.lat,stop.lng),
      stopover: false
    }];
    const req = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      waypoints: waypts,
    }

    directionService.route(req, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK)
      {
        console.log(status)
        directionDisplay.setDirections(result);
      } else
      {
        this.map.setCenter(origin);
      }
    })
    })
  }

  getDirections() {
    const origin = { lat: 52.041944, lng: -0.69351 };
    const destination = { lat: 52.916763, lng: -1.485883 };
    // this.map = new google.maps.Map(document.getElementById('map'), {
    //   center: origin,
    //   zoom: 16,
    //   styles
    // })

    const directionService = new google.maps.DirectionsService();
    const directionDisplay = new google.maps.DirectionsRenderer();

    directionDisplay.setMap(this.map);

    const req = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      // transitOptions: TransitOptions,
      // drivingOptions: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      // waypoints[]: DirectionsWaypoint,
    }

    directionService.route(req, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK)
      {
        console.log(status)
        directionDisplay.setDirections(result);
      } else
      {
        this.map.setCenter(origin);
      }
    })
  }

  getLocations() {
    return {
      locations: [

        {
          title: 'Sangam Chowk',
          latitude: 27.692612,
          longitude: 85.342982
        },
        {
          title: 'Kharikobot',
          latitude: 27.690227,
          longitude: 85.342671
        },
        {
          title: 'Ace Instute Of management',
          latitude: 27.690693,
          longitude: 85.339581
        }
      ]
    }
  }

}
