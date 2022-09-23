import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { ItemService } from 'src/app/items/item.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image'
import { ACCOUNT_NAME, ACCOUNT_SORT_CODE, ACCOUNT_NUMBER, BANK_TRANSFER_PAYMENT_TYPE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  order;
  accountName = ACCOUNT_NAME
  accountSortCode = ACCOUNT_SORT_CODE;
  accountNumber = ACCOUNT_NUMBER;

  constructor(private router: Router, private activatedroute: ActivatedRoute,
    private commonService: CommonService, private customersService: CustomersService,
    private itemService: ItemService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(async result => {
      console.log(result)
      this.spinner.show();
        if (result.data.isInError)
        {
          this.router.navigate(['/not-found']);
        } else
        {
          await this.processOrderInfo(result.data.order);
        }
    })
  }

  async processOrderInfo(rawOrder) {
    this.order = JSON.parse(JSON.stringify(rawOrder));
    this.order.customer =
    (await lastValueFrom(this.customersService.getCustomerByReference(this.order.customerReference))).data.customerByReference;
    this.order.items =
      (await lastValueFrom(this.itemService.getItemsByOrderReference(this.order.reference))).data.itemsByOrderReference;
    console.log(this.order)
    this.spinner.hide();

  }

  showSummary() {
    return this.order.customer && this.order.items;
  }

  isCustomerPersonal(customerType) {
    return this.commonService.isCustomerPersonal(customerType)
  }

  isPaymentTypeBankTransfer() {
    return this.order.paymentType === BANK_TRANSFER_PAYMENT_TYPE;
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
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


}
