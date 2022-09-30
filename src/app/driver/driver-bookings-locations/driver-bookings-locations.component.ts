import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';
import { CommonService } from 'src/app/service/common.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { styles } from './mapstyles';
const postcodes = require('node-postcodes.io')

@Component({
  selector: 'app-driver-bookings-locations',
  templateUrl: './driver-bookings-locations.component.html',
  styleUrls: ['./driver-bookings-locations.component.css']
})
export class DriverBookingsLocationsComponent implements OnInit, OnDestroy {

  bookings;
  dialog: any;
  router: any;
  geoLocations;
  googleMapsKey;
  currentLocation;
  errorMsg: string;
  isError: boolean;
  map: google.maps.Map;
  showNoBookings = false;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingsService) { }

  ngOnInit(): void {
    this.spinner.show()
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.getBookingsByDriverReference(reference);
  }

  getBookingsByDriverReference(reference) {
    this.bookingService.filterBookings({name: 'assignedDriverReference', value: reference})
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (this.isDataEmpty(result))
          {
            this.spinner.hide();
            console.log(result);
            this.alertError(reference);
          } else
          {
            this.displayBookings(result.data.filterBookings);
            this.spinner.hide();
          }
        },
        error: (error) => {
          console.log(error.message);
          console.log(error)
          this.spinner.hide();
          this.alertError(reference)
        }
    })
  }

  isDataEmpty(result) {
    return result === null || result.data === null ||
      result.data.filterBookings === null
  }

  alertError(reference) {
    console.log('error on driver with reference' + reference);
    const dialogRef =  this.dialog.open(InfoDialogComponent, {
      height: '30%',
      width: '30%',
      data: { message: `Sorry something went wrong, please contact system support` }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/bookings']);
    })
  }

  displayBookings(bookings) {
    this.bookings = bookings;
      if (this.bookings.length > 0)
      {
        this.getGeoLocations()
        this.getGoogleApiKey();
        this.calculateGeoLocationsDistances();
      } else
      {
        this.spinner.hide()
      }
  }

  showNoBookingsPage() {
    return this.bookings && this.bookings.length === 0;
  }

  async getGeoLocations() {
    const bookingsPostCodes = [];
    const morningBookings = this.getBookingsByPickUpTime('MORNING');
    const afternoonBookings = this.getBookingsByPickUpTime('AFTERNOON');
    const eveningBookings = this.getBookingsByPickUpTime('EVENING');

    const sortedBookings = morningBookings.concat(afternoonBookings).concat(eveningBookings);

    for ( const booking of sortedBookings ) {
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

  getBookingsByPickUpTime(pickUpTime: string) {
    return this.bookings.filter(obj => obj.pickUpTime === pickUpTime);
  }

  getGoogleApiKey() {
    this.commonService.getKeys().subscribe(
      ({ data }) => { this.googleMapsKey = data.getKeys.googleMapsKey; },
      error => { console.log(error); }
    );
  }

  calculateGeoLocationsDistances() {
    this.getCurrentPosition().then( pos => {
      // tslint:disable-next-line:no-string-literal
      this.currentLocation = { lat: pos['lat'], lng: pos['lng'], distance: null };
      this.geoLocations.unshift(this.currentLocation)

      for (const geolocation of this.geoLocations)
      {
        geolocation.distance = this.calculateDistance (
          geolocation.lat,  geolocation.lng,
          geolocation.lat, geolocation.lng, 'K');
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

        for (const middleLocation of middleLocations)
        {
          waypoints.push({
            location: new google.maps.LatLng(middleLocation.lat, middleLocation.lng),
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

  getCurrentPosition() {
    {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resp => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });},
          err => {reject(err);});
      });
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
