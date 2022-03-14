import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BOOKING_ITEMS, BOOKING_ITEMS_DISPLAY_NAMES } from 'src/app/constants';

@Component({
  selector: 'app-booking-items',
  templateUrl: './booking-items.component.html',
  styleUrls: ['./booking-items.component.css', '../../shared/shared.css']
})
export class BookingItemsComponent implements OnInit {
  bookingItemForm: FormGroup;
  types = BOOKING_ITEMS_DISPLAY_NAMES

  constructor(private formBuilder: FormBuilder) {
    this.bookingItemForm = this.formBuilder.group({
      quantity: ['', [Validators.required]],
      type: [this.types[0], Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
      pricePerUnit: ['', Validators.required],
      totalPrice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  getFormControl(fControlName: string) {
    return this.bookingItemForm.get(fControlName)
  }

}
