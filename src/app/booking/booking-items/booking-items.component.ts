import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BOOKING_ITEMS, BOOKING_ITEMS_TYPES_DISPLAY_NAMES, FULL_PAYMENT_STATUS_ALIAS,
  NO_PAYMENT_PAYMENT_STATUS_ALIAS,
  PARTIAL_PAYMENT_STATUS_ALIAS, PAYMENT_STATUSES, PAYMENT_TYPES
} from 'src/app/constants';
import { ItemsListComponent } from '../items-list/items-list.component';
import { ItemService } from '../../items/item.service';

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
  styleUrls: ['./booking-items.component.css', '../../shared/shared-new-form.css']
})
export class BookingItemsComponent implements OnInit {
  @Input() paymentData;
  @ViewChild(ItemsListComponent) itemsListComponent: ItemsListComponent;
  showItems = false;
  bookingItemForm: FormGroup;
  paymentForm: FormGroup;
  showDescription = false;
  types = BOOKING_ITEMS_TYPES_DISPLAY_NAMES;
  typesObject = BOOKING_ITEMS
  paymentTypes = PAYMENT_TYPES
  paymentStatuses = PAYMENT_STATUSES;
  itemsObjs;

  constructor(private formBuilder: FormBuilder, private itemService:ItemService) {}

  ngOnInit(): void {
    console.log(this.paymentData)
    this.paymentForm = this.formBuilder.group({
      paymentType: [this.paymentData.paymentType ? this.paymentData.paymentType : this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.paymentData.paymentStatus ? this.paymentData.paymentStatus : this.paymentStatuses[0], Validators.required],
      paymentNotes: [this.paymentData.paymentNotes ? this.paymentData.paymentNotes : '', []],
      amountPaid: [this.paymentData.amountPaid ? this.paymentData.amountPaid : 0,  []],
      amountOutstanding: [this.paymentData.amountOutstanding ? this.paymentData.amountOutstanding: 0 , []]

    })
    console.log(this.paymentForm.get('paymentStatus').value)
    this.paymentForm.get('amountOutstanding').disable();
    this.isAmountPaidEnabled();
    this.populateFields()
  }

  populateFields() {
    if (this.paymentData.reference)
    {
      this.itemService.getItemsByBookingReference(this.paymentData.reference).subscribe(
        ({ data }) => {
          const items = data.itemsByBookingReference;
          if (items.length > 0)
          {
            this.itemsObjs = items;
            this.updateTotalAmount()
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }


  onSelectionChange(event: any, fControlName: string) {
    this.paymentForm.get(fControlName).setValue(event.value);
    if (fControlName === 'paymentStatus')
    {
      this.setPaymentProperties(event.value)
      // const amounts = this.getAmountPaidValueByPaymentStatus(event.value);
      // this.paymentForm.get('amountPaid').setValue(amounts.amountPaid);
      // this.paymentForm.get('amountOutstanding').setValue(amounts.amountOutstanding);
      // this.isAmountPaidEnabled();
    }
  }

  setPaymentProperties(paymentStatus: string) {
    const totalAmount = this.getItemsDetails().totalAmount;
    const totalAmountControl =  this.paymentForm.get('totalAmount');
    const amountPaidControl =  this.paymentForm.get('amountPaid');
    const outstandingPaidControl =  this.paymentForm.get('amountOutstanding');

    switch(paymentStatus) {
      case FULL_PAYMENT_STATUS_ALIAS:
        amountPaidControl.setValue(totalAmount);
        outstandingPaidControl.setValue(0);
        amountPaidControl.disable();
        break;
      case PARTIAL_PAYMENT_STATUS_ALIAS:
        outstandingPaidControl.setValue(outstandingPaidControl.value)
        amountPaidControl.enable();
        break;
      case NO_PAYMENT_PAYMENT_STATUS_ALIAS:
        amountPaidControl.setValue(0);
        outstandingPaidControl.setValue(totalAmount);
        amountPaidControl.disable();
        break;
    }

  }


  getAmountPaidValueByPaymentStatus(paymentStatus) {
    let amountPaid = 0;
    const totalAmount = this.getItemsDetails().totalAmount;
    switch(paymentStatus) {
      case FULL_PAYMENT_STATUS_ALIAS:
        amountPaid = totalAmount;
        break;
      case PARTIAL_PAYMENT_STATUS_ALIAS:
        amountPaid = this.paymentData.amountPaid;
        break;
      case NO_PAYMENT_PAYMENT_STATUS_ALIAS:
        amountPaid = 0;
        break;
      default:
        amountPaid = 1;
    }
    return { amountPaid, amountOutstanding: amountPaid > totalAmount ? 0 : totalAmount - amountPaid };
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
    const payment: any = { paymentType: '', paymentStatus: '', paymentNotes: '', amountPaid: '', amountOutstanding: ''}
    Object.entries(payment).forEach((key) => {
      const attributeName = key[0];
      payment[attributeName] = this.getPaymentFormControl(attributeName).value;
    })
    return payment;
  }


  isDisabled() {
    return this.itemsListComponent.showWarning() ? true : !this.showItems ? false : !this.bookingItemForm.valid;
  }

  isAmountPaidEnabled() {
    if (this.paymentForm.get('paymentStatus').value === PARTIAL_PAYMENT_STATUS_ALIAS)
    {
      this.paymentForm.get('amountPaid').enable();
    } else
    {
      this.paymentForm.get('amountPaid').disable();

    }
  }

  updateTotalAmount() {
    if (this.paymentForm.get('paymentStatus').value === FULL_PAYMENT_STATUS_ALIAS)
    {
      this.paymentForm.get('amountPaid').setValue(this.getItemsDetails().totalAmount);
    }
    this.updateOutstandingAmount();

  }

  updateOutstandingAmount() { // toDO  vedere se questo calcolo si puo fare meglio senza dover chiamare items tutte le volte
    // this.isAmountPaidEnabled()
    // const totalAmount = this.getItemsDetails().totalAmount;
    // let amountPaid = this.paymentForm.get('amountPaid').value;

    // if (amountPaid >= totalAmount)
    // {
    //   amountPaid = totalAmount;
    //   this.paymentForm.get('amountPaid').setValue(amountPaid);
    //   this.paymentForm.get('paymentStatus').setValue(FULL_PAYMENT_STATUS_ALIAS)
    // }
    // this.paymentForm.get('amountOutstanding').setValue(totalAmount - amountPaid);
    const totalAmount = this.getItemsDetails().totalAmount;
    const amountPaidControl = this.paymentForm.get('amountPaid');
    const outstandingPaidControl = this.paymentForm.get('amountOutstanding');
    if (parseInt(amountPaidControl.value, 10) <= 0)
    {
      amountPaidControl.setValue(0);
      outstandingPaidControl.setValue(totalAmount);
      this.paymentForm.get('paymentStatus').setValue(NO_PAYMENT_PAYMENT_STATUS_ALIAS)
    } else
    {
      if (amountPaidControl.value >= totalAmount)
      {
        amountPaidControl.setValue(totalAmount);
        this.paymentForm.get('paymentStatus').setValue(FULL_PAYMENT_STATUS_ALIAS)
        outstandingPaidControl.setValue(0);
      } else
      {
        this.paymentForm.get('paymentStatus').setValue(PARTIAL_PAYMENT_STATUS_ALIAS)
        outstandingPaidControl.setValue(totalAmount - amountPaidControl.value);
      }
    }
  }

}
