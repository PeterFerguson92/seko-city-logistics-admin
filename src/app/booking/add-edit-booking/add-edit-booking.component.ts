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
        this.booking = Object.assign({selected: false}, data.booking);


        this.getCustomerByReference(data.booking.senderReference);

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

  getCustomerByReference(customerReference: string) {
    this.customersService.getCustomerByReference(customerReference).subscribe(
      ({ data }) => {
        this.booking.customer = data.customerByReference
      },
      error => {
        console.log(error);
      }
    );
  }
}
