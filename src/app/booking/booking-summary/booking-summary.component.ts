import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subject, takeUntil, tap } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { CommonService } from 'src/app/service/common.service';
import { ItemService } from '../../items/item.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { ACCOUNT_NAME, ACCOUNT_NUMBER, ACCOUNT_SORT_CODE, BANK_TRANSFER_PAYMENT_TYPE } from 'src/app/constants';
import { BookingsService } from '../service/bookings/bookings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private itemService: ItemService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingsService,
    private customersService: CustomersService) { }

  items;
  sender
  receivers;
  booking
  show = false;
  accountName = ACCOUNT_NAME
  accountSortCode = ACCOUNT_SORT_CODE;
  accountNumber = ACCOUNT_NUMBER;
  showInvoice = false;
  componentDestroyed$: Subject<boolean> = new Subject();

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.getBookingByReference(reference);
  }

  getBookingByReference(reference) {
    this.spinner.show();
    this.bookingService.getBookingByReference(reference)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (result) => {
            if (result.data.bookingByReference === null)
            {
              this.alertError(reference)
            } else
            {
              this.processBookingInfo(result.data.bookingByReference);
            }
          this.spinner.hide()
      },
      error: (error) => {
        this.spinner.hide();
        console.log('error for booking ' + reference)
        console.log(error.message);
        console.log(error)
        this.alertError(reference);
      }
    })
  }

  alertError(reference) {
    const dialogRef =  this.dialog.open(InfoDialogComponent, {
      height: '30%',
      width: '30%',
      data: { message: `Sorry something went wrong, please contact system support` }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/bookings']);
    })
  }

  async processBookingInfo(rawBooking) {
    this.booking = JSON.parse(JSON.stringify(rawBooking));
    this.booking.sender =
      (await lastValueFrom(this.customersService.getCustomerByReference(this.booking.senderReference))).data.customerByReference;
    this.booking.receivers =
      (await lastValueFrom(this.customersService.getCustomersByReferences(this.booking.receiverReferences))).data.customersByReferences
    this.booking.items =
      (await lastValueFrom(this.itemService.getItemsByBookingReference(this.booking.reference))).data.itemsByBookingReference;
  }

  showBookingSummary() {
    return this.booking && this.booking.sender && this.booking.receivers && this.booking.items;
  }

  async getItems() {
    return (await lastValueFrom(this.itemService.getItemsByBookingReference(this.booking.reference))).data.itemsByBookingReference;
  }

  isCustomerPersonal(customerType) {
    return this.commonService.isCustomerPersonal(customerType)
  }

  isPaymentTypeBankTransfer() {
    return this.booking.paymentType === BANK_TRANSFER_PAYMENT_TYPE;
  }

  getFormattedDate(date) {
    return date === null ? 'TBD' : this.commonService.getFormattedDate(date);
  }

  getBankReference() {
    return this.booking.reference.split('-')[0]
  }

  exportAsPDF() {
    const summary = document.getElementById('summary');
    const height = summary.clientHeight;
    const width = summary.clientWidth;
    const options = { background: 'white', width , height };

    domtoimage.toPng(summary, options).then((imgData) => {
      const doc = new jsPDF(width > height ? 'l' : 'p', 'mm', [width, height]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`booking_${this.getTimeStamp()}_${this.booking.reference}.pdf`);
    })
  }

  getTimeStamp() {
    return this.commonService.getTimeStamp(this.booking.createdAt);
  }

  editBooking() {
    this.router.navigate(['/edit-booking', this.booking.reference, this.booking.senderReference]);
  }

  generateInvoice() {
    this.showInvoice = !this.showInvoice;
  }

  getButtonName() {
    return this.showInvoice ? 'Show Summary' : 'Generate Invoice' ;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
