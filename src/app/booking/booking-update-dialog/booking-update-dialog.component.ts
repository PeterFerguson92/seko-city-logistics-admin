import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BOOKING_STATUSES } from 'src/app/constants';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-update-dialog',
  templateUrl: './booking-update-dialog.component.html',
  styleUrls: ['./booking-update-dialog.component.css', '../../shared/shared.dialog.css']
})
export class BookingUpdateDialogComponent implements OnInit {

  bookingInfoForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;
  errorText;
  showErrorText;

  constructor(private formBuilder: FormBuilder, private bookingService: BookingsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.bookingInfoForm = this.formBuilder.group({
      status: [this.data.booking.status],
    });
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onSubmit() {
    this.bookingService.updateBookingStatus(this.data.booking.reference, this.getFormControl('status').value).subscribe(
      ({ data }) => {
        if (data.updateBookingStatus.isInError)
        {
          this.showErrorText = true
          this.errorText = data.updateBookingStatus.errorMessage
        } else
        {
          location.reload();
        }
      },
      error => {
        console.log(error);
      }
    );
   }

  getFormControl(fControlName: string) {
    return this.bookingInfoForm.get(fControlName)
  }

}
