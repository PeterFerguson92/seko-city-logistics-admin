import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BOOKING_PICKUP_TIMES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AvailabilityDialogComponent } from '../availability-dialog/availability-dialog.component';

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.css', '../../shared/shared-new-form.css']
})
export class BookingInfoComponent implements OnInit, AfterViewInit {
  @Input() bookingInfo

  bookingInfoForm: FormGroup;
  times = BOOKING_PICKUP_TIMES
  addresses = [];
  formValidationMap = { postcode: '' };

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.bookingInfoForm = this.formBuilder.group({
      date: [this.bookingInfo.pickUpDate ? new Date(this.bookingInfo.pickUpDate) : new Date(), [Validators.required]],
      time: [this.bookingInfo.pickUpTime ? this.bookingInfo.pickUpTime :  this.times[0], [Validators.required]],
      postcode: [this.bookingInfo.pickUpPostCode ? this.bookingInfo.pickUpPostCode : '', [Validators.required,
      this.validationService.postCodeValidator]],
      address: [this.bookingInfo.pickUpAddress ? this.bookingInfo.pickUpAddress : '', [Validators.required]],
      updatesViaWhatsapp: [this.bookingInfo.updatesViaWhatsapp ? this.bookingInfo.updatesViaWhatsapp : true, [Validators.required]],
      updatesViaEmail: [this.bookingInfo.updatesViaEmail ? this.bookingInfo.updatesViaEmail : true, [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    this.validateFormControl('postcode');
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onPostcodeChange() {
    this.getAddressByPostcode()
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'updatesViaWhatsapp' || fControlName === 'updatesViaEmail' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

  onCheckAvailabilty() {
    this.dialog.open(AvailabilityDialogComponent, {
      height: '50%',
      width: '60%',
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
      this.commonService.getAddresses(postcodeFormControl.value).subscribe(
        ({ data }) => {
          this.addresses = data.addressesInfo.addresses;
        },
        error => {
          console.log(error);
        }
      );
    } else
    {
      this.addresses = [];
    }
  }

  isDisabled() {
    return !this.bookingInfoForm.valid;
  }

  getInfoDetails() {
    const info = {};
    Object.keys(this.bookingInfoForm.controls).forEach((control: string) => {
      if (control === 'date')
      {
        info[control] = this.commonService.getFormattedIsoDate(this.getFormControl(control).value);
      } else
      {
        info[control] = this.getFormControl(control).value;
      }
    });
    return info;
  }


}
