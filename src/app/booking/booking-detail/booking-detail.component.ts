import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { ReceiverComponent } from 'src/app/customer/receiver/receiver.component';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';
import { BookingReviewComponent } from '../booking-review/booking-review.component';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { VIEW_BOOKING_MODE } from 'src/app/constants';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css', '../../shared/shared.css']
})
export class BookingDetailComponent implements OnInit {
  @ViewChild(CustomerDetailComponent) customerDetailComponent: CustomerDetailComponent;
  @ViewChild(ReceiverComponent) receiverComponent: ReceiverComponent;
  @ViewChild(BookingItemsComponent) bookingItemsComponent: BookingItemsComponent;
  @ViewChild(BookingInfoComponent) bookingInfoComponent: BookingInfoComponent;
  @ViewChild(BookingReviewComponent) bookingReviewComponent: BookingReviewComponent;


  @Input() booking;
  @Input() mode

  constructor() { }

  ngOnInit(): void {}

  isDisabled(componentName: string) {
    if (componentName === 'customerDetailComponent')
    {
      // return true
      // return this.customerDetailComponent.isDisabled();
    } else
    {
      return true
    }
  }

  isViewOnlyMode() {
    return VIEW_BOOKING_MODE !== this.mode;
  }

  onForward(stepper: MatStepper, componentName: string) {
    if (!this[componentName].isDisabled())
    {
      if (stepper._getFocusIndex() === 3)
      {
        this.buildBook();
        this.bookingReviewComponent.updateBook(this.booking)
      }
      stepper.next();
    }
  };

  buildBook() {
    this.booking.sender = this.customerDetailComponent.getSenderDetails();
    this.booking.receiver = this.receiverComponent.getReceiverDetails();
    this.booking.itemsDetails = this.bookingItemsComponent.getItemsDetails();
    this.booking.info = this.bookingInfoComponent.getInfoDetails();
  }

  onCreateBooking() {

    const x = '{"customer":{"__typename":"Customer","id":2,"reference":"CUK-33735-PN2","title":"Mr","name":"Abigail","surname":"Amoah","fullName":"Mr Abigail Amoah","email":"test@gmail.com","countryCode":"+44","phone":"7948212772","fullPhoneNumber":"+447948212772","postcode":"MK17 8FG","address":"2 Watkin Terrace, , , , , Northampton, Northamptonshire","displayAddress":"2 Watkin Terrace, , , , , Northampton, Northamptonshire MK17 8FG","country":"UNITED KINGDOM","type":"PERSONAL","location":"","destination":"","role":"","registeredName":"","registeredNumber":""},"sender":{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"Abigail","surname":"Amoah-Korsah","countryCode":"+44","phone":"7948212772","email":"test@gmail.com","postcode":"MK17 8FG","address":"2 Watkin Terrace, , , , , Northampton, Northamptonshire","country":"UNITED KINGDOM","reference":"CUK-33735-PN2","role":"SENDER"},"receiver":{"receivers":[{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"John","surname":"Mensah","countryCode":"+44","phone":"07948212772"}],"destinationInfo":{"destination":"KOFORIDUA","location":"tesss"}},"itemsDetails":{"items":[{"quantity":1,"type":"SMALL BOX","description":"","value":"45","pricePerUnit":"30","amount":30},{"quantity":"3","type":"BIG BOX","description":"","value":"34","pricePerUnit":70,"amount":210},{"quantity":"11","type":"OTHER","description":"pampers","value":"1222","pricePerUnit":"10","amount":"11"}],"paymentInfo":{"paymentType":"DIRECT DEBIT","paymentStatus":"COMPLETED","notes":"some random notes","totalAmount":251},"totalNumberOfItems":15},"info":{"date":"2022-04-08T00:00:00.000Z","time":"MORNING","postcode":"se193ty","address":"2 Watkin Terrace, , , , , Northampton, Northamptonshire","updatesViaWhatsapp":true}}'
    const mock = JSON.parse(x);
    this.booking = mock;
    console.log(mock);
    if (mock.customer.reference)
    {
      console.log(this.getDifference(this.booking.sender, this.booking.customer))
      const fields = this.getDifference(this.booking.sender, this.booking.customer)
    }

  }

  getDifference(sender, customer) {
    const updateFields = []
    Object.entries(sender).forEach((key) => {
      const name = key[0];
      const value = key[1];

      if (sender[name] !== customer[name])
      {
        updateFields.push({name, value})
      }
    })

    return updateFields;
  }

}
