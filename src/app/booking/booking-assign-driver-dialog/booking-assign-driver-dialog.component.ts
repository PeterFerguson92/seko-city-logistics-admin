import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-assign-driver-dialog',
  templateUrl: './booking-assign-driver-dialog.component.html',
  styleUrls: ['./booking-assign-driver-dialog.component.css', '../../shared/shared.dialog.css']
})
export class BookingAssignDriverDialogComponent implements OnInit, OnDestroy {
  currentDriver;
  drivers;
  driversUsername;
  errorText;
  showErrorText = false;
  assignDriverForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private bookingService: BookingsService,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.loadDrivers();
    this.assignDriverForm = this.formBuilder.group({
      currentDriverUsername: [''],
      selectedDriverUsername: [''],
    })
    this.assignDriverForm.get('currentDriverUsername').disable();
  }

  getFormControl(fControlName: string) {
    return this.assignDriverForm.get(fControlName)
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  getDriversUsername() {
    return this.drivers ? this.drivers.map(a => a.username) : [];
  }

  getCurrentDriverUsername(reference) {
    if (this.drivers)
    {
      for (const driver of this.drivers)
      {
        if (driver.reference === reference){
          this.getFormControl('selectedDriverUsername').setValue(driver.username);
        }
      }
    }
  }

  getSelectedDriverReference() {
    let reference;
    const selectedDriverUsername = this.getFormControl('selectedDriverUsername').value;
    for (const driver of this.drivers)
      {
        if (driver.username === selectedDriverUsername) {
          reference = driver.reference;
        }
      }
    return reference;
  }

  loadDrivers() {
    this.spinner.show()
    this.authService.getDrivers()
      .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (result) => {
            this.showErrorText = false
            this.errorText = null
            this.drivers = result.data.getDrivers.users;
            this.driversUsername = this.getDriversUsername();
            this.getCurrentDriverUsername(this.data.assignedDriverReference);
            this.spinner.hide();
          },
          error: (error) => {
            this.showErrorText = true;
            this.errorText = `Loading Drivers failed: Please contact system support`;
            this.spinner.hide();
          }
        })
    }

  onSubmit() {
    const driverReference = this.getSelectedDriverReference();
    this.bookingService.updateBookingAssignedDriver(this.data.reference, driverReference)
    .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data && result.data.updateBookingAssignedDriver.isInError){
            this.showErrorText = true
            this.errorText = result.data.updateBookingAssignedDriver.errorMessage
          } else {
            location.reload();
          }
          this.spinner.hide()
        },
        error: (error) => {
          console.log(error);
          console.log(error.message);
          this.showErrorText = true
          this.errorText = `Update failed: Please contact system`;
          this.spinner.hide()
        }
      })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
