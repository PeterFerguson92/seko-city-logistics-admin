import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { CommonService } from 'src/app/service/common.service';
import { styles } from './mapstyles';
const postcodes = require('node-postcodes.io')

@Component({
  selector: 'app-driver-bookings-locations',
  templateUrl: './driver-bookings-locations.component.html',
  styleUrls: ['./driver-bookings-locations.component.css']
})
export class DriverBookingsLocationsComponent implements OnInit {

  map: google.maps.Map;
  bookings;
  googleMapsKey;
  geoLocations;
  currentLocation;
  showNoBookings = false;

  constructor(private activatedroute: ActivatedRoute, private authService: AuthenticationService,
    private spinner: NgxSpinnerService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.activatedroute.data.subscribe(data => {
      this.bookings = data.bookings;
      console.log(this.bookings)

      if (data.bookings.length > 1)
      {
        this.getGeoLocations(data.bookings)
        this.getGoogleApiKey();
        this.calculateGeoLocationsDistances();
      }
      this.spinner.hide()
    })
  }

  showNoBookingsPage() {
    console.log(this.bookings.length)
    return this.bookings.length === 0;
  }

  async getGeoLocations(bookings) {
    const bookingsPostCodes = [];
    for ( const booking of bookings ) {
      bookingsPostCodes.push(booking.pickUpPostCode);
    }

    const result = await postcodes.lookup(bookingsPostCodes, {filter: 'postcode,longitude,latitude'});

    if (result.status === 200)
    {
      this.geoLocations = result.result.map((item, index) => Object.assign({},
        {
          postCode: item.result.postcode,
          lat: item.result.latitude,
          lng: item.result.longitude,
          distance: null
        }));
    }
  }

  getGoogleApiKey() {
    this.authService.getKeys().subscribe(
      ({ data }) => { this.googleMapsKey = data.getKeys.googleMapsKey; },
      error => { console.log(error); }
    );
  }

  calculateGeoLocationsDistances() {
    this.getCurrentPosition().then( pos => {
      // tslint:disable-next-line:no-string-literal
      this.currentLocation = { lat: pos['lat'], lng: pos['lng'], distance: null };
      this.geoLocations.unshift(this.currentLocation)
       // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.geoLocations.length; i++) {
        this.geoLocations[i].distance = this.calculateDistance (
        this.geoLocations[0].lat,  this.geoLocations[0].lng,
        this.geoLocations[i].lat,  this.geoLocations[i].lng, 'K');
      }

      const sortedLocation = this.geoLocations.sort((a, b) => {
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
 //   this.spinner.hide()
  }

  getCurrentPosition() {
    {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resp => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });},
          err => {reject(err);});
      });
    }
  }


}
