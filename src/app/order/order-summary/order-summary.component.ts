import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subject, takeUntil, tap } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { ItemService } from 'src/app/items/item.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image'
import { ACCOUNT_NAME, ACCOUNT_SORT_CODE, ACCOUNT_NUMBER, BANK_TRANSFER_PAYMENT_TYPE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../service/order.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  order;
  accountName = ACCOUNT_NAME
  accountSortCode = ACCOUNT_SORT_CODE;
  accountNumber = ACCOUNT_NUMBER;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private itemService: ItemService,
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService ) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.getOrderByReference(reference);
  }

  getOrderByReference(reference) {
    this.spinner.show();
    this.orderService.getOrderByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data.orderByReference === null)
          {
            this.alertError(reference)
          } else
          {
            this.processOrderInfo(result.data.orderByReference);
          }
        this.spinner.hide()
      },
      error: (error) => {
        this.spinner.hide();
        console.log('error for order ' + reference)
        console.log(error.message);
        console.log(error)
        this.alertError(reference)
      }
  })
}

  async processOrderInfo(rawOrder) {
    if (rawOrder === null)
    {
      this.router.navigate(['/not-found']);
    } else
    {
      this.order = JSON.parse(JSON.stringify(rawOrder));
      this.order.customer =
        (await lastValueFrom(this.customersService.getCustomerByReference(this.order.customerReference))).data.customerByReference;
      this.order.items =
        (await lastValueFrom(this.itemService.getItemsByOrderReference(this.order.reference))).data.itemsByOrderReference;
      this.spinner.hide();
    }
  }

  alertError(reference) {
    const dialogRef =  this.dialog.open(InfoDialogComponent, {
      height: '30%',
      width: '30%',
      data: { message: `Sorry something went wrong, please contact system support` }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/orders']);
    })
  }

  showSummary() {
    return this.order && this.order.customer && this.order.items;
  }

  isCustomerPersonal(customerType) {
    return this.commonService.isCustomerPersonal(customerType)
  }

  isPaymentTypeBankTransfer() {
    return this.order.paymentType === BANK_TRANSFER_PAYMENT_TYPE;
  }

  getFormattedDate(date) {
    return date === null ? 'TBD' : this.commonService.getFormattedDate(date);
  }

  getBankReference() {
    return this.order.reference.split('-')[0]
  }

  getNumberOfItems() {
    return this.order.items ? this.order.items.length : 0
  }

  exportAsPDF() {
    this.spinner.show();
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
      doc.save(`order_${this.getTimeStamp()}_${this.order.reference}.pdf`);
    })
    this.spinner.hide();
  }

  getTimeStamp() {
    return this.commonService.getTimeStamp(this.order.createdAt);
  }

  editOrder() {
    this.router.navigate(['/edit-order', this.order.reference, this.order.customerReference]);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }


}
