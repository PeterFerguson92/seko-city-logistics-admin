import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';
import { BookingReviewComponent } from '../booking-review/booking-review.component';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { CREATE_BOOKING_MODE, VIEW_BOOKING_MODE } from 'src/app/constants';
import { lastValueFrom } from 'rxjs';
import { IBooking } from '../model';
import { BookingsService } from '../service/bookings.service';
import { Router } from '@angular/router';
import { ICustomer } from 'src/app/customer/model';
import { BookingsReceiversComponent } from '../bookings-receivers/bookings-receivers.component';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css', '../../shared/shared.css']
})
export class BookingDetailComponent implements OnInit {
  @ViewChild(CustomerDetailComponent) customerDetailComponent: CustomerDetailComponent;
  @ViewChild(BookingsReceiversComponent) bookingReceiversComponent: BookingsReceiversComponent;
  @ViewChild(BookingItemsComponent) bookingItemsComponent: BookingItemsComponent;
  @ViewChild(BookingInfoComponent) bookingInfoComponent: BookingInfoComponent;
  @ViewChild(BookingReviewComponent) bookingReviewComponent: BookingReviewComponent;


  @Input() booking;
  @Input() mode
  senderFullName: string;


  constructor(private router: Router, private customersService: CustomersService, private bookingsService: BookingsService) { }

  ngOnInit(): void { }

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
    this.booking.receiver = this.bookingReceiversComponent.getReceiverDetails();
    this.booking.itemsDetails = this.bookingItemsComponent.getItemsDetails();
    this.booking.info = this.bookingInfoComponent.getInfoDetails();
  }

  async onCreateBooking() {
    if (CREATE_BOOKING_MODE === this.mode)
    {
      if (this.booking.customer && this.booking.customer.reference)
      {
        const fields = this.getDifference(this.booking.sender, this.booking.customer)
        await this.updateCustomer(this.booking.customer.reference, fields);
        const recvReference = await this.saveReceivers(this.booking.receiver.receivers);
        this.saveBooking(this.booking.customer, recvReference, this.booking)

      }
      else
      {
        const senderDetails = await this.saveSender(this.booking.sender);
        const recvReference = await this.saveReceivers(this.booking.receiver.receivers);
        this.saveBooking(senderDetails, recvReference, this.booking)
      }

    } else
    {
      const fields = this.getDifference(this.booking.sender, this.booking.customer);
      await this.updateCustomer(this.booking.customer.reference, fields);
      await this.syncReceivers(this.booking.reference, this.booking.receiver.receivers);
      await this.syncItems(this.booking.reference, this.booking.itemsDetails.items)
      this.syncBooking(this.booking)
    }

  }

  getDifference(obj1, obj2) {
    const updateFields = []
    Object.entries(obj1).forEach((key) => {
      const name = key[0];
      const value = key[1];
      if (obj1[name] !== obj2[name])
      {
        updateFields.push({name, value})
      }
    })

    return updateFields;
  }

  async updateCustomer(reference, fields) {
    if (fields.length > 0)
    {
      this.customersService.updateCustomer(reference, fields).subscribe(
        ({ data }) => {
          console.log(data)
        },
        error => {
          console.log(error);
        }
      );
    }
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
      senderId: this.booking.customer.id,
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

    this.bookingsService.createBooking(booking).subscribe(
      ({ data }) => {
        this.redirectToBookings()
      },
      error => {
        console.log(error);
      }
    )
    return booking;
  }

  syncItems(bookingReference, items) {
    this.bookingsService.syncItems(bookingReference, items).subscribe(
      ({ data }) => {
        this.redirectToBookings()
      },
      error => {
        console.log(error);
      }
    )
  }

  syncBooking(bookingInfo) {
    this.bookingsService.syncBooking(this.buildBookingInput(bookingInfo)).subscribe(
      ({ data }) => {
        this.redirectToBookings()
      },
      error => {
        console.log(error);
      }
    )
  }

  syncReceivers(reference, receivers: [ICustomer]) {
    if (receivers.length > 0)
    {
      this.bookingsService.syncReceivers(reference, receivers).subscribe(
        ({ data }) => {
          this.redirectToBookings()
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  buildBookingInput(bookingInfo) {
    return {
      id: null,
      reference: bookingInfo.reference,
      senderId: this.booking.customer.id,
      senderReference: '',
      senderFullName: '',
      receiverReferences: [],
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
      status: bookingInfo.status,
      shipmentReference: bookingInfo.shipmentReference,
      assignedDriverReference: bookingInfo.assignedDriverReference
    };
  }

  redirectToBookings() {
    this.router.navigate(['/bookings']).then(() => {
      window.location.reload();
    });
  }

}
