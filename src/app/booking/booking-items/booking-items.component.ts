import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BOOKING_ITEMS, BOOKING_ITEMS_DISPLAY_NAMES, PAYMENT_STATUSES, PAYMENT_TYPES } from 'src/app/constants';

export interface IItem {
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
  styleUrls: ['./booking-items.component.css', '../../shared/shared.css']
})
export class BookingItemsComponent implements OnInit {
  showItems = false;
  bookingItemForm: FormGroup;
  paymentForm: FormGroup;
  showDescription = false;
  types = BOOKING_ITEMS_DISPLAY_NAMES;
  typesObject = BOOKING_ITEMS
  paymentTypes = PAYMENT_TYPES
  paymentStatuses = PAYMENT_STATUSES

  get items(): FormArray {
    return this.bookingItemForm.get('items') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bookingItemForm = this.formBuilder.group({
      items: this.formBuilder.array([this.buildItem()])
    });

    this.paymentForm = this.formBuilder.group({
      paymentType: [this.paymentTypes[0] , [Validators.required]],
      paymentStatus: [this.paymentStatuses[0], Validators.required],
      notes: ['', []]
    })
  }

  buildItem(): FormGroup {
    return this.formBuilder.group({
      quantity: [ 1 , [Validators.required]],
      type: [this.types[0], Validators.required],
      description: [''],
      value: ['', Validators.required],
      pricePerUnit: [this.typesObject[0].PRICE, Validators.required],
      amount: [parseInt(this.typesObject[0].PRICE, 10) * 1, Validators.required]
    })
  }

  onAddItem(index) {
    if (!this.isItemValuePopulated(index))
    {
      this.items.push(this.buildItem());
    }
  }

  onDeleteItem(index) {
    if (this.items.length > 1)
    {
      this.items.removeAt(index)
    } else
    {
      this.showItems = false;

    }
  }

  onSelectionChange(event: any, fControlName: string, index) {
    if (fControlName === 'paymentType' || fControlName === 'paymentStatus')
    {
      this.paymentForm.get(fControlName).setValue(event.value);
    } else
    {
      const fControl = this.getItemFormControl(fControlName, index);
      fControl.setValue(event.value);
      fControl.markAsDirty();

      const quantity = this.getItemFormControl('quantity', index).value;
      const pricePerUnit = this.getPricePerUnit(event.value);
      this.getItemFormControl('pricePerUnit', index).setValue(pricePerUnit);
      this.getItemFormControl('amount', index).setValue(this.calculateTotalPrice(quantity, pricePerUnit));

      const descriptionFormControl = this.getItemFormControl('description', index);
      if (fControlName === 'type' && event.value === 'OTHER')
      {
        descriptionFormControl.setValidators([Validators.required]);
        this.getItemFormControl('amount', index).setValue(0);
        this.getItemFormControl('pricePerUnit', index).setValue(0);
      } else
      {
        descriptionFormControl.setValidators([]);
        descriptionFormControl.markAsPristine();
        descriptionFormControl.setValue('');
      }
    }
  }

  onInputChange(quantity, index) {
    const pricePerUnit = this.getPricePerUnit(this.getItemFormControl('type', index).value);
    this.getItemFormControl('amount', index).setValue(this.calculateTotalPrice(quantity, pricePerUnit));
  }

  calculateTotalPrice(quantity, pricePerUnit) {
    return quantity * pricePerUnit;
  }

  getPricePerUnit(selection: string) {
    let price = 0;
    BOOKING_ITEMS.forEach((element) => {
      if (element.DISPLAY_NAME === selection)
      {
        price = parseInt(element.PRICE, 10);
      }
    });

    return price;
  }

  getItemFormControl(fControlName: string, index) {
    return this.items.controls[index].get(fControlName);
  }

  getPaymentFormControl(fControlName: string) {
    return this.paymentForm.get(fControlName);
  }

  showDesc(index) {
    return this.getItemFormControl('type', index).value === 'OTHER';
  }

  onShowItems() {
    this.showItems = true
  }

  isItemValuePopulated(index) {
    return !this.getItemFormControl('value', index).valid;
  }

  getTotalNumberOfItems() {
    let total = 0;
    if (!this.showItems)
    {
      return total;
    }
    this.items.controls.forEach((control) => {
      total = total + parseInt(control.get('quantity').value, 10);
    });
    return total;
  }

  getTotalAmount() {
    let totalAmount = 0;
    if (!this.showItems)
    {
      return totalAmount;
    }
    this.items.controls.forEach((control) => {
      totalAmount = totalAmount + parseInt(control.get('amount').value, 10);
    });
    return totalAmount;
  }

  getItemsDetails() {
    return {items: this.getItemsDataDetails(), paymentInfo: this.getPaymentInfoDetails(), totalNumberOfItems: this.getTotalNumberOfItems()}
  }

  getItemsDataDetails() {
    const itemsData = [];
    if (this.showItems)
    {
      this.items.controls.forEach((control) => {
        itemsData.push(this.buildItemObject(control))
      });
    }
    return itemsData;
  }

  getPaymentInfoDetails() {
    const payment: any = { paymentType: '', paymentStatus: '', notes: '', totalAmount: 0}
    if (!this.showItems)
    {
      return payment
    }
    Object.entries(payment).forEach((key) => {
      const attributeName = key[0];
      payment[attributeName] = this.getPaymentFormControl(attributeName).value;
    })
    payment.totalAmount = this.getTotalAmount();
    return payment;
  }

  buildItemObject(control: AbstractControl) {
    const item: any = { quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }
    Object.entries(item).forEach((key) => {
      const attributeName = key[0];
      item[attributeName] = control.get(attributeName).value;
    })
    return item;
  }

  isDisabled() {
    return !this.showItems ? false : !this.bookingItemForm.valid;
  }
}
