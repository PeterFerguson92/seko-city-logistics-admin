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
      this.booking.sender = data.customer
    })
    }


  ngOnInit(): void {

  //   this.sub = this.activatedroute.paramMap.subscribe(params => {
  //      const reference = params.get('reference');
  //      this.sub = this.customersService.getCustomerByReference(reference).subscribe(
  //       ({ data }) => {
  //          this.booking.sender = data.customerByReference;
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //  });
  }

  ngOnDestroy(): void {
  //  this.sub.unsubscribe();
  }
}
