import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BOOKING_PICKUP_TIMES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.css', '../../shared/shared.css']
})
export class BookingInfoComponent implements OnInit {

  bookingInfoForm: FormGroup;
  times = BOOKING_PICKUP_TIMES
  addresses = [];

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.bookingInfoForm = this.formBuilder.group({
      date: [new Date().toISOString(), [Validators.required]],
      time: [this.times[0], [Validators.required]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, this.validationService.postCodeValidator]],
      updatesViaWhatsapp: [true, [Validators.required]]
    })
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(this.commonService.getFormattedDate(event))
    fControl.markAsDirty();
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'updates' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

  onCheckAvailabilty() {
    console.log(this.getFormControl('date').value)
  }

  getFormControl(fControlName: string) {
    return this.bookingInfoForm.get(fControlName)
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  isDisabled() {
    return !this.bookingInfoForm.valid;
  }

  getInfoDetails() {
    const info: any = { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '' }
    Object.entries(info).forEach((key) => {
      const attributeName = key[0];
      if (attributeName === 'date')
      {
        info[attributeName] = this.commonService.getFormattedDate(this.getFormControl(attributeName).value);
      } else
      {
        info[attributeName] = this.getFormControl(attributeName).value;
      }
    })
    return info;
  }


}
