import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BOOKING_ITEMS, BOOKING_ITEMS_DISPLAY_NAMES } from 'src/app/constants';

@Component({
  selector: 'app-booking-items',
  templateUrl: './booking-items.component.html',
  styleUrls: ['./booking-items.component.css', '../../shared/shared.css']
})
export class BookingItemsComponent implements OnInit {
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
      types: [this.types[0], Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
      pricePerUnit: [this.typesObject[0].PRICE, Validators.required],
      totalPrice: [parseInt(this.typesObject[0].PRICE, 10) * 1, Validators.required]
    })
  }

  onAddItem() {
    this.items.push(this.buildItem());
  }

  onDeleteItem(index) {
    if (this.items.length > 1)
    {
      this.items.removeAt(index)
    }
  }

  onSelectionChange(event: any, fControlName: string, index) {
    const fControl = this.getFormControl(fControlName, index);
    fControl.setValue(event.value);
    fControl.markAsDirty();

    const quantity = this.getFormControl('quantity', index).value;
    const pricePerUnit = this.getPricePerUnit(event.value);
    this.getFormControl('pricePerUnit', index).setValue(pricePerUnit);
    this.getFormControl('totalPrice', index).setValue(this.calculateTotalPrice(quantity, pricePerUnit));

    const descriptionFormControl = this.getFormControl('description', index);
    if (fControlName === 'types' && event.value === 'OTHER')
    {
      descriptionFormControl.setValidators([Validators.required]);
      this.getFormControl('totalPrice', index).setValue(0);
      this.getFormControl('pricePerUnit', index).setValue(0);
    } else
    {
      descriptionFormControl.setValidators([]);
      descriptionFormControl.markAsPristine();
      descriptionFormControl.setValue('');
    }
  }

  onInputChange(quantity, index) {
    const pricePerUnit = this.getPricePerUnit(this.getFormControl('types', index).value);
    this.getFormControl('totalPrice', index).setValue(this.calculateTotalPrice(quantity, pricePerUnit));
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

  getFormControl(fControlName: string, index) {
    return this.items.controls[index].get(fControlName)
  }

  showDesc(index) {
    return this.getFormControl('types', index).value === 'OTHER';
  }
}
