import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BOOKING_PICKUP_TIMES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AvailabilityDialogComponent } from '../availability-dialog/availability-dialog.component';

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.css', '../../shared/shared.css']
})
export class BookingInfoComponent implements OnInit {
  @Input() pickUpDate;
  @Input() pickUpTime;
  @Input() pickUpPostCode;
  @Input() pickUpAddress;
  @Input() updatesViaWhatsapp;

  bookingInfoForm: FormGroup;
  times = BOOKING_PICKUP_TIMES
  addresses = [];

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.bookingInfoForm = this.formBuilder.group({
      date: [this.pickUpDate ? new Date(this.pickUpDate) : new Date(), [Validators.required]],
      time: [this.pickUpTime ? this. pickUpTime :  this.times[0], [Validators.required]],
      postcode: [this.pickUpPostCode ? this.pickUpPostCode : '', [Validators.required, this.validationService.postCodeValidator]],
      address: [this.pickUpAddress ? this.pickUpAddress : '', [Validators.required]],
      updatesViaWhatsapp: [this.updatesViaWhatsapp === null ? this.updatesViaWhatsapp : true, [Validators.required]]
    })
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'updatesViaWhatsapp' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

  onCheckAvailabilty() {
    this.dialog.open(AvailabilityDialogComponent, {
      height: '50%',
      width: '50%',
      data: { date: this.commonService.getFormattedIsoDate(this.getFormControl('date').value) }
    });
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
        info[attributeName] = this.commonService.getFormattedIsoDate(this.getFormControl(attributeName).value);
      } else
      {
        info[attributeName] = this.getFormControl(attributeName).value;
      }
    })
    return info;
  }


}
