import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BOOK_CUSTOMER_MODE } from 'src/app/constants';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css', '../../shared/shared.css']
})
export class BookingDetailComponent implements OnInit {
  @ViewChild(CustomerDetailComponent) customerDetailComponent:CustomerDetailComponent;
  @ViewChild(BookingItemsComponent) bookingItemsComponent:BookingItemsComponent;

  @Input() booking;
  mode
  constructor() { }

  ngOnInit(): void {
    this.mode = BOOK_CUSTOMER_MODE
  }

  selectionChange(stepper) {
    console.log(stepper)
    console.log(this.customerDetailComponent.getSenderDetails())
    console.log(this.bookingItemsComponent.getItemsData())
  }

}
