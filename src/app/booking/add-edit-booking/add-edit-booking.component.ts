import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_BOOKING_CUSTOMER_MODE, CREATE_BOOKING_MODE, EDIT_BOOKING_MODE } from '../../constants';

@Component({
  selector: 'app-add-edit-booking',
  templateUrl: './add-edit-booking.component.html',
  styleUrls: ['./add-edit-booking.component.css']
})
export class AddEditBookingComponent implements OnInit {

  sub;
  booking: any = {};
  mode = null;
  constructor(private activatedroute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      if (this.router.url.includes('edit-booking'))
      {
        if (this.isDataEmpty(data)){
          this.router.navigate(['/not-found']);
        }
        this.mode = EDIT_BOOKING_MODE
        this.booking = Object.assign({selected: false}, data.booking[0].data.bookingByReference);
        this.booking.customer = data.booking[1].data.customerByReference;
      } else
      {
        if (this.router.url.includes('add-booking'))
        {
          if (this.isDataEmpty(data)){
            this.router.navigate(['/not-found']);
          }
          this.booking.customer = data.customer;
          this.mode = data.customer ? ADD_BOOKING_CUSTOMER_MODE : CREATE_BOOKING_MODE;
        }
      }
    })
  }

  isDataEmpty(data) {
    return data.booking[0].data.bookingByReference === null ||
      data.booking[1].data.customerByReference === null
  }
}
