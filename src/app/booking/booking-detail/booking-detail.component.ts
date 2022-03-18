import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { BOOK_CUSTOMER_MODE } from 'src/app/constants';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { ReceiverComponent } from 'src/app/customer/receiver/receiver.component';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';
import { BookingReviewComponent } from '../booking-review/booking-review.component';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css', '../../shared/shared.css']
})
export class BookingDetailComponent implements OnInit {
  @ViewChild(CustomerDetailComponent) customerDetailComponent: CustomerDetailComponent;
  @ViewChild(ReceiverComponent) receiverComponent:ReceiverComponent;
  @ViewChild(BookingItemsComponent) bookingItemsComponent: BookingItemsComponent;
  @ViewChild(BookingInfoComponent) bookingInfoComponent: BookingInfoComponent;
  @ViewChild(BookingReviewComponent) bookingReviewComponent: BookingReviewComponent;


  @Input() booking;
  mode

  constructor() { }

  ngOnInit(): void {
    this.mode = BOOK_CUSTOMER_MODE
    this.booking.sender2 = { type: '', fullName: '', code: '', phone: '', email: '', postcode: '', address: '', country: '' };
    this.booking.receiver = { type: '', fullName: '', code: '', phone: '', destination: '', otherDestination: '' };
    this.booking.itemsDetails = {
      items: [{ quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }],
      paymentInfo: { paymentType: '', paymentStatus: '', notes: '', totalAmount: '' }, totalNumberOfItems: 0
    };
    this.booking.info = { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '' };
  }

  selectionChange(stepper) {
    // console.log(stepper)
    // console.log(this.customerDetailComponent.getSenderDetails())
    // console.log(this.customerDetailComponent.isDisabled())
    // console.log(this.bookingItemsComponent.getItemsData())
  }

  isDisabled(componentName: string) {
    if (componentName === 'customerDetailComponent')
    {
      console.log(this.customerDetailComponent.getSenderDetails())
      return true
      // return this.customerDetailComponent.isDisabled();
    } else
    {
      return true
    }
  }

  onForward(stepper: MatStepper, componentName: string) {
    if (!this[componentName].isDisabled())
    {
      stepper.next();
      if (stepper._getFocusIndex() === 4)
      {
        this.buildBook();
        this.bookingReviewComponent.updateBook(this.booking)
      }
    }
  };

  buildBook() {
    this.booking.sender2 = this.customerDetailComponent.getSenderDetails();
    this.booking.receiver = this.receiverComponent.getReceiverDetails();
    this.booking.itemsDetails = this.bookingItemsComponent.getItemsDetails();
    this.booking.info = this.bookingInfoComponent.getInfoDetails();
  }

  onCreateBooking() {


    console.log(JSON.stringify(this.booking));

  }

}
