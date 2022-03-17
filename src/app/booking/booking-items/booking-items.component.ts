import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { BOOKING_ITEMS, BOOKING_ITEMS_DISPLAY_NAMES } from 'src/app/constants';

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
  showDescription = false;
  types = BOOKING_ITEMS_DISPLAY_NAMES;
  typesObject = BOOKING_ITEMS

  get items(): FormArray {
    return this.bookingItemForm.get('items') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bookingItemForm = this.formBuilder.group({
      items: this.formBuilder.array([this.buildItem()])
    });
  }

  buildItem(): FormGroup {
    return this.formBuilder.group({
      quantity: [ 1 , [Validators.required]],
      type: [this.types[0], Validators.required],
      description: ['', Validators.required],
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
    return this.items.controls[index].get(fControlName)
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
    this.items.controls.forEach((control) => {
      total = total + parseInt(control.get('quantity').value, 10);
    });
    return total;
  }

  getTotalAmount() {
    let totalAmount = 0;
    this.items.controls.forEach((control) => {
      totalAmount = totalAmount + parseInt(control.get('amount').value, 10);
    });
    return totalAmount;
  }

  getItemsData() {
    const itemsData = [];
    if (this.showItems)
    {
      this.items.controls.forEach((control) => {
        itemsData.push(this.buildItemObject(control))
      });
    }
    return itemsData;
  }

  buildItemObject(control: AbstractControl) {
    const item: any = { quantity: 0, type: '', description: '', value: '', pricePerUnit: '', amount: 0 }
    Object.entries(item).forEach((key) => {
      const attributeName = key[0];
      item[attributeName] = control.get(attributeName).value;
    })
    return item;
  }
}
