import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'src/app/customer/service/customers.service';

@Component({
  selector: 'app-add-edit-booking',
  templateUrl: './add-edit-booking.component.html',
  styleUrls: ['./add-edit-booking.component.css']
})
export class AddEditBookingComponent implements OnInit, OnDestroy {

  sub;
  booking: any = {};
  constructor(
    private activatedroute: ActivatedRoute,
    private customersService: CustomersService,
    private router: Router) {

    this.activatedroute.data.subscribe(data => {
      if (router.url.includes('edit-booking'))
      {
        this.booking = Object.assign({selected: false}, data.booking[0].data.bookingByReference);
        this.booking.customer = data.booking[1].data.customerByReference;
      } else
      {
        this.booking.customer = data.customer
      }
    })
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  //  this.sub.unsubscribe();
  }
}
