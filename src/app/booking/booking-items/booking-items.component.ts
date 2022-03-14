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

  get items(): FormArray {
    return this.bookingItemForm.get('items') as FormArray;
  }


  constructor(private formBuilder: FormBuilder) {
    this.bookingItemForm = this.formBuilder.group({
      items: this.formBuilder.array([this.buildItem()])
    });
  }

  ngOnInit(): void {
  }

  onSelectionChange(event: any, fControlName: string, index) {
    const fControl = this.getFormControl(fControlName, index);
    const descriptionFormControl = this.getFormControl('description', index);
    if (fControlName === 'type' && event.value === 'OTHER')
    {
      this.showDescription = true;
      descriptionFormControl.setValidators([Validators.required]);
      // this.validateFormControl('otherDestination');
    } else
    {
      this.showDescription = false;
      descriptionFormControl.setValidators([]);
      descriptionFormControl.markAsPristine();
      descriptionFormControl.setValue('');
    }
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  getFormControl(fControlName: string, index) {
    return this.items.controls[index].get(fControlName)
  }

  buildItem(): FormGroup {
    return this.formBuilder.group({
      quantity: [0, [Validators.required]],
      types: [this.types[0], Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
      pricePerUnit: ['0', Validators.required],
      totalPrice: ['0', Validators.required]
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
}
