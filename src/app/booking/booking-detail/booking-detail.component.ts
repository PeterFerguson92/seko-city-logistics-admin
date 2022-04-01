import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { ReceiverComponent } from 'src/app/customer/receiver/receiver.component';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';
import { BookingReviewComponent } from '../booking-review/booking-review.component';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { VIEW_BOOKING_MODE } from 'src/app/constants';
import { lastValueFrom } from 'rxjs';
import { IBooking } from '../model';
import { BookingsService } from '../service/bookings.service';

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

  constructor(private customersService: CustomersService, private bookingsService: BookingsService) { }

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

  async onCreateBooking() {
    // console.log(this.booking)
    // console.log(JSON.stringify(this.booking))
    // tslint:disable-next-line:max-line-length
    // const x = '{"sender":{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Miss","name":"Comfort","surname":"boateng","countryCode":"+44","phone":"7880256714","email":"test@gmail.com","postcode":"se193ty","address":"2 Watkin Terrace, , , , , Northampton, Northamptonshire","country":"UNITED KINGDOM","reference":null,"role":"SENDER"},"receiver":{"receivers":[{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"test1","surname":"etee","countryCode":"+44","phone":"07948212772"},{"type":"PERSONAL","registeredName":"","registeredNumber":"","title":"Mr","name":"etete","surname":"etetet","countryCode":"+44","phone":"7948321334"}],"destinationInfo":{"destination":"KUMASI","location":"wrwrwr"}},"itemsDetails":{"items":[{"quantity":1,"type":"SMALL BOX","description":"","value":4535,"pricePerUnit":30,"amount":30},{"quantity":3,"type":"SMALL BOX","description":"","value":555,"pricePerUnit":30,"amount":90}],"paymentInfo":{"paymentType":"DIRECT DEBIT","paymentStatus":"COMPLETED","paymentNotes":"sfsf","totalAmount":120},"totalNumberOfItems":4},"info":{"date":"2022-03-31T15:24:08.000Z","time":"MORNING","postcode":"se193ty","address":"14 Watkin Terrace, , , , , Northampton, Northamptonshire","updatesViaWhatsapp":true}}'
    // const mock = JSON.parse(x);
    // console.log(mock)
    // this.booking = mock;
    if (this.booking.customer && this.booking.customer.reference)
    {
      const fields = this.getDifference(this.booking.sender, this.booking.customer)
    } else
    {
      const senderDetails = await this.saveSender(this.booking.sender);
      const recvReference = await this.saveReceivers(this.booking.receiver.receivers);
      this.saveBooking(senderDetails, recvReference, this.booking)
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

  async saveSender(customerDetails) {
    const saved = await lastValueFrom(this.customersService.createCustomer(customerDetails))
     // tslint:disable-next-line:no-string-literal
    return { reference: saved.data['createCustomer'].reference, fullName: saved.data['createCustomer'].fullName } ;
  }

  async saveReceivers(receiversDetails) {
    const recvReferences = [];
    const saved = await lastValueFrom(this.customersService.createCustomers(receiversDetails))
    saved.data.createCustomers.forEach(recv => {recvReferences.push(recv.reference);})
    return recvReferences;
  }

  saveBooking(senderDetails, recvReferences, bookingInfo) {
    const booking: IBooking = {
      id: null,
      reference: '',
      senderReference: senderDetails.reference,
      senderFullName: senderDetails.fullName,
      receiverReferences: recvReferences,
      destination: bookingInfo.receiver.destinationInfo.destination,
      location: bookingInfo.receiver.destinationInfo.location,
      items: bookingInfo.itemsDetails.items,
      numberOfItems: bookingInfo.itemsDetails.totalNumberOfItems,
      totalAmount: bookingInfo.itemsDetails.paymentInfo.totalAmount,
      paymentType: bookingInfo.itemsDetails.paymentInfo.paymentType,
      paymentStatus: bookingInfo.itemsDetails.paymentInfo.paymentStatus,
      paymentNotes: bookingInfo.itemsDetails.paymentInfo.paymentNotes,
      pickUpDate: bookingInfo.info.date,
      pickUpTime: bookingInfo.info.time,
      pickUpPostCode: bookingInfo.info.postcode,
      pickUpAddress: bookingInfo.info.address,
      updatesViaWhatsapp: bookingInfo.info.updatesViaWhatsapp,
      status: '',
      shipmentReference: '',
      assignedDriverReference: ''
    };

    console.log(booking)
    this.bookingsService.createBooking(booking).subscribe(
      ({ data }) => {
        console.log(data)
      },
      error => {
        console.log(error);
      }
    )
    return booking;
  }

}
