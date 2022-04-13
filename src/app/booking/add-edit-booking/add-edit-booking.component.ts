import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CREATE_BOOKING_MODE, EDIT_BOOKING_MODE, VIEW_BOOKING_MODE } from 'src/app/constants';
import { CustomersService } from 'src/app/customer/service/customers.service';

@Component({
  selector: 'app-add-edit-booking',
  templateUrl: './add-edit-booking.component.html',
  styleUrls: ['./add-edit-booking.component.css']
})
export class AddEditBookingComponent implements OnInit, OnDestroy {

  sub;
  booking: any = {};
  mode = null;
  constructor(private activatedroute: ActivatedRoute, private router: Router) {

    this.activatedroute.data.subscribe(data => {
      if (router.url.includes('edit-booking') || router.url.includes('view-booking') )
      {
        this.mode = router.url.includes('edit-booking') ? EDIT_BOOKING_MODE : VIEW_BOOKING_MODE
        this.booking = Object.assign({selected: false}, data.booking[0].data.bookingByReference);
        this.booking.customer = data.booking[1].data.customerByReference;
      } else
      {
        this.booking.customer = data.customer
        this.mode = CREATE_BOOKING_MODE
      }
    })
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  //  this.sub.unsubscribe();
  }
}
