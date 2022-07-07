import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { styles } from './mapstyles';

@Component({
  selector: 'app-bookings-locations',
  templateUrl: './bookings-locations.component.html',
  styleUrls: ['./bookings-locations.component.css']
})
export class BookingsLocationsComponent implements OnInit {
  places: any;
  title = 'google-maps';
  map: google.maps.Map;
  googleMapsKey;
  mockLocations = [
  { lat: 51.486784, lng: -3.171499, distance: null},
  { lat: 52.916763, lng: -1.485883, distance: null },
  { lat: 51.411802, lng: -0.095092, distance: null },
  { lat: 52.125991, lng: -0.499651, distance: null }];

  currentLocation;

  constructor(private authService: AuthenticationService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.getGoogleApiKey();
    this.calculateLocations();
    this.places = this.getLocations();
  }

  getGoogleApiKey() {
    this.authService.getKeys().subscribe(
      ({ data }) => { this.googleMapsKey = data.getKeys.googleMapsKey; },
      error => { console.log(error); }
    );
  }

  calculateLocations() {
    this.getLocations().then( pos => {
      // tslint:disable-next-line:no-string-literal
      this.currentLocation = { lat: pos['lat'], lng: pos['lng'], distance: null };
      this.mockLocations.unshift(this.currentLocation)
       // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.mockLocations.length; i++) {
        this.mockLocations[i].distance = this.calculateDistance (
        this.mockLocations[0].lat,  this.mockLocations[0].lng,
        this.mockLocations[i].lat,  this.mockLocations[i].lng, 'K');
      }

      const sortedLocation = this.mockLocations.sort((a, b) => {
      return a.distance - b.distance;
      });
      const locationsData = this.buildFirstMiddleLastList(sortedLocation);
      this.loadGoogleMaps(locationsData[0], locationsData[1], locationsData[2])
    });
  }

   buildFirstMiddleLastList = (list) => {
    const { 0: first, [list.length - 1]: last, ...rest } = list;

    return [
      first,
      Object.values(rest),
      list.length > 1 ? last : undefined
    ];
  };


  calculateDistance(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = Math.PI * lat1/180
    const radlat2 = Math.PI * lat2/180
    const radlon1 = Math.PI * lon1/180
    const radlon2 = Math.PI * lon2/180
    const theta = lon1-lon2
    const radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }

  loadGoogleMaps(originLocation, middleLocations, destinationLocation) {

    if (this.googleMapsKey)
    {
      const loader = new Loader({
        apiKey: this.googleMapsKey
      })

      loader.load().then(() => {
        const origin = { lat: originLocation.lat, lng: originLocation.lng };
        const destination = { lat: destinationLocation.lat, lng: destinationLocation.lng };

        const waypoints = [];

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < middleLocations.length; i++)
        {
          waypoints.push({
            location: new google.maps.LatLng(middleLocations[i].lat, middleLocations[i].lng),
            stopover: true
          })
        }

        this.map = new google.maps.Map(document.getElementById('map'), {
          center: origin,
          zoom: 14,
          styles
        })

        const directionService = new google.maps.DirectionsService();
        const directionDisplay = new google.maps.DirectionsRenderer();
        directionDisplay.setMap(this.map);

        const req = {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          waypoints,
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
    this.spinner.hide()
  }

  getLocations() {
    {
      return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(resp => {

          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
          err => {
            reject(err);
          });
      });
    }
  }

}
