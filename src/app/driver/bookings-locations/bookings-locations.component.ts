import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-bookings-locations',
  templateUrl: './bookings-locations.component.html',
  styleUrls: ['./bookings-locations.component.css']
})
export class BookingsLocationsComponent implements OnInit {
  places: any;

  constructor() { }

  ngOnInit(): void {
    this.places = this.getLocations()
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
