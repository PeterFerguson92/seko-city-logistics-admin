import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { CommonService } from 'src/app/service/common.service';
import { ItemService } from '../service/items/item.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent implements OnInit {

  constructor(private activatedroute: ActivatedRoute,
    private commonService: CommonService,
    private customersService: CustomersService,
    private itemService: ItemService) { }

  items;
  sender
  receivers;
  booking
  show = false;

  ngOnInit(): void {
    this.activatedroute.data.subscribe(async data => {
      this.booking = JSON.parse(JSON.stringify(data.booking));
      this.booking.sender =
        (await lastValueFrom(this.customersService.getCustomerByReference(this.booking.senderReference))).data.customerByReference;
      this.booking.receivers =
        (await lastValueFrom(this.customersService.getCustomersByReferences(this.booking.receiverReferences))).data.customersByReferences
      this.booking.items =
        (await lastValueFrom(this.itemService.getItemsByBookingReference(this.booking.reference))).data.itemsByBookingReference;
    })
  }


  showBookingSummary() {
    return this.booking.sender && this.booking.receivers && this.booking.items;
  }

  async getItems() {
    return (await lastValueFrom(this.itemService.getItemsByBookingReference(this.booking.reference))).data.itemsByBookingReference;
  }

  isCustomerPersonal(customerType) {
    return this.commonService.isCustomerPersonal(customerType)
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }
}
