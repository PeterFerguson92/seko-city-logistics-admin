import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BOOKING_STATUSES, PAYMENT_STATUSES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { BookingsService } from '../service/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css', '../../shared/shared.css']
})
export class BookingsComponent implements OnInit {
  bookingsFilterForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;
  paymentStatuses = PAYMENT_STATUSES
  bookings = null;

  constructor(
    private formBuilder: FormBuilder,
    private bookingsService: BookingsService,
    private validationService: ValidationService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    const today:any = new Date();
    const days = 86400000;
    const fiveDaysAgo = new Date(today - (7 * days));

    this.bookingStatuses.unshift('ALL','OPEN')
    this.paymentStatuses.unshift('ALL')

    this.bookingsFilterForm = this.formBuilder.group({
      status: [this.bookingStatuses[0]],
      postcode: ['', [this.validationService.postCodeValidator]],
      reference: ['', [this.validationService.postCodeValidator]],
      paymentStatus: [this.paymentStatuses[0]],
      fromDate: [fiveDaysAgo],
      toDate: [today],
      useRange: [true, [Validators.required]]
    })
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'useRange' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onSearch() {
   // console.log(this.buildFilterFields());
    this.bookingsService.filterBookings(this.buildFilterFields()).subscribe(
      ({ data }) => {
        // tslint:disable-next-line:no-string-literal
        console.log(data['filterBookings']);
                // tslint:disable-next-line:no-string-literal
        this.bookings = data['filterBookings'];
      },
      error => {
        console.log(error);
      }
    );
  }

  isRangeEnabled() {
   return this.getFormControl('useRange').value;
  }

  getFormControl(fControlName: string) {
    return this.bookingsFilterForm.get(fControlName)
  }

  buildFilterFields() {
    const filters: any = {status: '', postcode: '', reference: '', paymentStatus: '', fromDate: '', toDate: ''}
    const fields = []

    Object.entries(filters).forEach((key) => {
      const attributeName = key[0];
      const filter = { name: '', value: '' };
      if ((attributeName === 'fromDate' || attributeName === 'toDate') && !this.getFormControl('useRange').value)
      {
        return;
      }
      else
      {

        filter.value = attributeName === 'fromDate' || attributeName === 'toDate' ?
          this.commonService.getFormattedIsoDate(this.getFormControl(attributeName).value) :
          this.getFormControl(attributeName).value;
      }
      filter.name = attributeName;
      fields.push(filter)
    })

    return fields;
  }

}
