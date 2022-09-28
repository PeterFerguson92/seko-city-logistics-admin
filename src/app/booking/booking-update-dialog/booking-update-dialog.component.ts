import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BOOKING_STATUSES } from 'src/app/constants';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-update-dialog',
  templateUrl: './booking-update-dialog.component.html',
  styleUrls: ['./booking-update-dialog.component.css', '../../shared/shared.dialog.css']
})
export class BookingUpdateDialogComponent implements OnInit, OnDestroy {

  bookingInfoForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;
  errorText;
  showErrorText;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bookingService: BookingsService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    if (this.data === null || this.data.order === null)
    {
      this.router.navigate(['/not-found']);
    }
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
    this.bookingService.updateBookingStatus(this.data.booking.reference, this.getFormControl('status').value)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data.updateBookingStatus.isInError)
            {
              this.showErrorText = true
              this.errorText = result.data.updateBookingStatus.errorMessage
            } else
            {
              location.reload();
          }
        },
        error: (error) => {
          console.log(error);
          console.log(error.message);
          this.showErrorText = true;
          this.errorText = `Update failed: Please contact system support`;
        }
      })
  }

  getFormControl(fControlName: string) {
    return this.bookingInfoForm.get(fControlName)
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
