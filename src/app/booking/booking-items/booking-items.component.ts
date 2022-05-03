import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BOOKING_ITEMS, BOOKING_ITEMS_TYPES_DISPLAY_NAMES, PAYMENT_STATUSES, PAYMENT_TYPES } from 'src/app/constants';
import { ItemsListComponent } from '../items-list/items-list.component';
import { BookingsService } from '../service/bookings/bookings.service';
import { ItemService } from '../service/items/item.service';

export interface IItem {
  id: number
  quantity: number;
  type: string;
  description: string;
  value: string;
  pricePerUnit: string;
  amount: number;
}

@Component({
  selector: 'app-booking-items',
  templateUrl: './booking-items.component.html',
  styleUrls: ['./booking-items.component.css', '../../shared/shared-form.css']
})
export class BookingItemsComponent implements OnInit {
  @Input() reference;
  @Input() paymentType;
  @Input() paymentStatus;
  @Input() paymentNotes
  @ViewChild(ItemsListComponent) itemsListComponent: ItemsListComponent;
  showItems = false;
  bookingItemForm: FormGroup;
  paymentForm: FormGroup;
  showDescription = false;
  types = BOOKING_ITEMS_TYPES_DISPLAY_NAMES;
  typesObject = BOOKING_ITEMS
  paymentTypes = PAYMENT_TYPES
  paymentStatuses = PAYMENT_STATUSES
  itemsObjs;


  constructor(private formBuilder: FormBuilder, private itemService:ItemService) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      paymentType: [this.paymentType ? this.paymentType : this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.paymentStatus ? this.paymentStatus : this.paymentStatuses[0], Validators.required],
      paymentNotes: [this.paymentNotes ? this.paymentNotes : '', []]
    })
    this.populateFields()
  }

  populateFields() {
    if (this.reference)
    {
      this.itemService.getItemsByBookingReference(this.reference).subscribe(
        ({ data }) => {
          const items = data.itemsByBookingReference;
          if (items.length > 0)
          {
            this.itemsObjs = items;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }


  onSelectionChange(event: any, fControlName: string, index) {
    if (fControlName === 'paymentType' || fControlName === 'paymentStatus')
    {
      this.paymentForm.get(fControlName).setValue(event.value);
    }
  }

  getPaymentFormControl(fControlName: string) {
    return this.paymentForm.get(fControlName);
  }

  getItemsDetails() {
    const itemsDetails = this.itemsListComponent.getItemsDataDetails();
    return {
      items: itemsDetails.items, paymentInfo: this.getPaymentInfoDetails(),
      totalNumberOfItems: itemsDetails.totals.totalItems,
      totalAmount: itemsDetails.totals.totalAmount,
    }
  }

  getPaymentInfoDetails() {
    const payment: any = { paymentType: '', paymentStatus: '', paymentNotes: ''}
    Object.entries(payment).forEach((key) => {
      const attributeName = key[0];
      payment[attributeName] = this.getPaymentFormControl(attributeName).value;
    })
    return payment;
  }


  isDisabled() {
    return !this.showItems ? false : !this.bookingItemForm.valid;
  }
}
