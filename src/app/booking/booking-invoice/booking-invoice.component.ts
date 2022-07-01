import { Component, Input, OnInit } from '@angular/core';
import { ACCOUNT_NAME, ACCOUNT_SORT_CODE, ACCOUNT_NUMBER } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.css']
})
export class BookingInvoiceComponent implements OnInit {
  @Input() booking;
  accountName = ACCOUNT_NAME
  accountSortCode = ACCOUNT_SORT_CODE;
  accountNumber = ACCOUNT_NUMBER;
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    console.log(this.booking)
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }
}
