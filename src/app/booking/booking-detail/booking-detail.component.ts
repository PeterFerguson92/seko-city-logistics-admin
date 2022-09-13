import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { BookingInfoComponent } from '../booking-info/booking-info.component';
import { BookingItemsComponent } from '../booking-items/booking-items.component';
import { BookingReviewComponent } from '../booking-review/booking-review.component';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { EDIT_BOOKING_MODE, VIEW_BOOKING_MODE } from 'src/app/constants';
import { lastValueFrom } from 'rxjs';
import { BookingsService } from '../service/bookings/bookings.service';
import { Router } from '@angular/router';
import { ICustomer } from 'src/app/customer/model';
import { BookingsReceiversComponent } from '../bookings-receivers/bookings-receivers.component';
import { MatDialog } from '@angular/material/dialog';
import { AttachInvoiceDialogComponent } from '../attach-invoice-dialog/attach-invoice-dialog.component';

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

  constructor(private router: Router, private dialog: MatDialog,
    private customersService: CustomersService,
    private bookingsService: BookingsService) { }

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

  getSenderRef() {
    return this.booking.customer && this.booking.customer.reference ? this.booking.customer.reference : this.booking.senderReference
  }

  getPaymentData() {
    return {
      reference: this.booking.reference,
      paymentType: this.booking.paymentType,
      paymentStatus: this.booking.paymentStatus,
      paymentNotes: this.booking.paymentNotes,
      amountPaid: this.booking.amountPaid,
      amountOutstanding: this.booking.amountOutstanding,
      totalAmount: this.booking.totalAmount,
      numberOfItems: this.booking.numberOfItems
    }
  }

  getBookingInfoData() {
    return {
      pickUpDate: this.booking.pickUpDate,
      pickUpTime: this.booking.pickUpTime,
      pickUpPostCode: this.booking.pickUpPostCode,
      paymentNotes: this.booking.paymentNotes,
      pickUpAddress: this.booking.pickUpAddress,
      updatesViaWhatsapp: this.booking.updatesViaWhatsapp,
      updatesViaEmail: this.booking.updatesViaEmail,
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(AttachInvoiceDialogComponent, {
      // data: { date: this.commonService.getFormattedIsoDate(this.getFormControl('date').value) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      const attachInvoice = result === 'true';
      console.log(attachInvoice)
      this.processBooking(attachInvoice)
    })
  }

  async processBooking(attachInvoice) {

    if (EDIT_BOOKING_MODE === this.mode)
    {
      const fields = this.getDifference(this.booking.sender, this.booking.customer)
      if (fields.length > 0)
      {
        const senderDetails = await this.updateCustomer(this.booking.customer.reference, fields);
        this.booking.senderId = senderDetails.id;
        this.booking.senderReference = senderDetails.reference;
        this.booking.senderFullName = senderDetails.fullName;
      }
      await this.syncReceivers(this.booking.reference, this.booking.receiver.receivers);
      await this.syncItems(this.booking.reference, this.booking.itemsDetails.items)
      this.syncBooking(this.booking, attachInvoice)
    }
    else
    {
      if (this.booking.customer && this.booking.customer.reference)
      {
        let senderDetails = this.booking.customer
        const fields = this.getDifference(this.booking.sender, this.booking.customer)
        if (fields.length > 0)
        {
          senderDetails = await this.updateCustomer(this.booking.customer.reference, fields);
          this.booking.senderId = senderDetails.id;
          this.booking.senderReference = senderDetails.reference;
          this.booking.senderFullName = senderDetails.fullName;
        }
        const recvReference = await this.getReceiverReferences(this.booking.receiver.receivers);
        this.saveBooking(senderDetails, recvReference, this.booking, attachInvoice)
      } else
      {
        const senderDetails = await this.saveSender(this.booking.sender);
        const recvReference = await this.saveReceivers(this.booking.receiver.receivers);
        this.saveBooking(senderDetails, recvReference, this.booking, attachInvoice)
      }
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

  async getReceiverReferences(receivers) {
    const recvToSave = [];
    const existingRecvReference = []
    for (const recv of receivers) {
      if (recv.reference === null) {
        recvToSave.push(recv);
      } else
      {
        existingRecvReference.push(recv.reference);
      }
    }
    const savedRecvReferences = await this.saveReceivers(recvToSave);
    const concat = existingRecvReference.concat(savedRecvReferences);
    return concat;
  }

  async updateCustomer(reference, fields) {
    const saved = await lastValueFrom(this.customersService.updateCustomer(reference, fields))
    // tslint:disable-next-line:no-string-literal
    const senderDetails = saved.data['updateCustomer'];
    return { reference: senderDetails.reference, fullName: senderDetails.fullName, id: senderDetails.id } ;
  }


  async saveSender(customerDetails) {
    const saved = await lastValueFrom(this.customersService.createCustomer(customerDetails))
     // tslint:disable-next-line:no-string-literal
    const senderDetails = saved.data['createCustomer'];
    return { reference: senderDetails.reference, fullName: senderDetails.fullName, id: senderDetails.id } ;
  }

  async saveReceivers(receiversDetails) {
    const recvReferences = [];
    const saved = await lastValueFrom(this.customersService.createCustomers(receiversDetails));
    saved.data.createCustomers.forEach(recv => { recvReferences.push(recv.reference); });
    return recvReferences;
  }

  saveBooking(senderDetails, recvReferences, bookingInfo, attachInvoice) {
    const booking = {
      id: null,
      reference: '',
      senderId: senderDetails.id ? senderDetails.id : bookingInfo.customer.id,
      senderReference: senderDetails.reference ? senderDetails.reference : bookingInfo.customer.reference,
      senderFullName: senderDetails.fullName ? senderDetails.fullName : bookingInfo.customer.fullName,
      receiverReferences: recvReferences,
      destination: bookingInfo.receiver.destinationInfo.destination,
      location: bookingInfo.receiver.destinationInfo.location,
      items: bookingInfo.itemsDetails.items,
      numberOfItems: bookingInfo.itemsDetails.totalNumberOfItems,
      totalAmount: bookingInfo.itemsDetails.totalAmount,
      paymentType: bookingInfo.itemsDetails.paymentInfo.paymentType,
      paymentStatus: bookingInfo.itemsDetails.paymentInfo.paymentStatus,
      amountPaid: Number(bookingInfo.itemsDetails.paymentInfo.amountPaid),
      amountOutstanding: Number(bookingInfo.itemsDetails.paymentInfo.amountOutstanding),
      paymentNotes: bookingInfo.itemsDetails.paymentInfo.paymentNotes,
      pickUpDate: bookingInfo.info.date,
      pickUpTime: bookingInfo.info.time,
      pickUpPostCode: bookingInfo.info.postcode,
      pickUpAddress: bookingInfo.info.address,
      updatesViaWhatsapp: bookingInfo.info.updatesViaWhatsapp,
      updatesViaEmail: bookingInfo.info.updatesViaEmail,

      shipmentReference: '',
      assignedDriverReference: ''
    };
    this.bookingsService.createBooking(booking, attachInvoice).subscribe(
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

  syncBooking(bookingInfo, attachInvoice) {
    this.bookingsService.syncBooking(this.buildBookingInput(bookingInfo), attachInvoice).subscribe(
      ({ data }) => {
        // this.redirectToBookings()
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

  // todo merge builders
  buildBookingInput(bookingInfo) {
    return {
      id: bookingInfo.id,
      reference: bookingInfo.reference ? bookingInfo.reference : '',
      senderId: this.booking.customer.id,
      senderReference: this.booking.senderReference,
      senderFullName: this.booking.senderFullName,
      receiverReferences: [],
      destination: bookingInfo.receiver.destinationInfo.destination,
      location: bookingInfo.receiver.destinationInfo.location,
      items: bookingInfo.itemsDetails.items,
      numberOfItems: bookingInfo.itemsDetails.totalNumberOfItems,
      totalAmount: bookingInfo.itemsDetails.totalAmount,
      paymentType: bookingInfo.itemsDetails.paymentInfo.paymentType,
      paymentStatus: bookingInfo.itemsDetails.paymentInfo.paymentStatus,
      paymentNotes: bookingInfo.itemsDetails.paymentInfo.paymentNotes,
      amountPaid: Number(bookingInfo.itemsDetails.paymentInfo.amountPaid),
      amountOutstanding: Number(bookingInfo.itemsDetails.paymentInfo.amountOutstanding),
      pickUpDate: bookingInfo.info.date,
      pickUpTime: bookingInfo.info.time,
      pickUpPostCode: bookingInfo.info.postcode,
      pickUpAddress: bookingInfo.info.address,
      updatesViaWhatsapp: bookingInfo.info.updatesViaWhatsapp,
      updatesViaEmail: bookingInfo.info.updatesViaEmail,
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
