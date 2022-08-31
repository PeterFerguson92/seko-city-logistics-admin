import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BOOKING_STATUSES } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-update-dialog',
  templateUrl: './booking-update-dialog.component.html',
  styleUrls: ['./booking-update-dialog.component.css', '../../shared/shared.dialog.css']
})
export class BookingUpdateDialogComponent implements OnInit {

  bookingInfoForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;

  constructor(private formBuilder: FormBuilder,
    private bookingService: BookingsService,
    public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

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
          location.reload();
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
