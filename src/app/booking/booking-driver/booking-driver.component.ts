import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-driver',
  templateUrl: './booking-driver.component.html',
  styleUrls: ['./booking-driver.component.css', '../../shared/shared-new-form.css']
})
export class BookingDriverComponent implements OnInit, OnDestroy {
  drivers;
  errorText;
  currentDriver
  driversUsername;
  bookingReference;
  showErrorText = false;
  currentDriverReference;
  driversCheckBoxList = [];
  selectedMateReferences = [];
  assignedMatesReferences = [];
  assignDriverForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingsService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.bookingReference = reference;
    this.getBookingByReference(reference);
    this.assignDriverForm = this.formBuilder.group({
      currentDriverUsername: [''],
      selectedDriverUsername: [''],
    })
    this.assignDriverForm.get('currentDriverUsername').disable();
  }

  getBookingByReference(reference) {
    this.spinner.show();
    this.bookingService.getBookingByReference(reference)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (result) => {
            if (result.data.bookingByReference === null)
            {
              this.alertError(reference)
            } else
            {
              const data = result.data.bookingByReference;
              this.currentDriverReference = data.assignedDriverReference;
              this.assignedMatesReferences = data.assignedMatesReferences ? data.assignedMatesReferences : [];
              this.loadDrivers();
              this.spinner.hide();
            }
          this.spinner.hide()
      },
      error: (error) => {
        this.spinner.hide();
        console.log('error for booking ' + reference)
        console.log(error.message);
        console.log(error)
        this.alertError(reference);
      }
    })
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
            this.getCurrentDriverUsername(this.currentDriverReference);
            this.buildDriversCheckBox();
            this.spinner.hide();
          },
          error: (error) => {
            this.showErrorText = true;
            this.errorText = `Loading Drivers failed: Please contact system support`;
            this.spinner.hide();
          }
        })
    }

  alertError(reference) {
    const dialogRef =  this.dialog.open(InfoDialogComponent, {
      height: '30%',
      width: '30%',
      data: { message: `Sorry something went wrong, please contact system support` }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/bookings']);
    })
  }

  getFormControl(fControlName: string) {
    return this.assignDriverForm.get(fControlName)
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  async getDriversInfo() {
    this.loadDrivers();
  }

  getDriversUsername() {
    return this.drivers ? this.drivers.map(a => a.username) : [];
  }

  getCurrentDriverUsername(reference) {
    if (this.drivers)
    {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.drivers.length; i++)
      {
        if (this.drivers[i].reference === reference)
        {
          this.getFormControl('currentDriverUsername').setValue(this.drivers[i].username);
          this.getFormControl('selectedDriverUsername').setValue(this.drivers[i].username);
        }
      }
    }
  }

  getSelectedDriverReference() {
    let reference;
    const selectedDriverUsername = this.getFormControl('selectedDriverUsername').value;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.drivers.length; i++)
    {
      if (this.drivers[i].username === selectedDriverUsername)
      {
        reference = this.drivers[i].reference;
      }
    }
    return reference;
  }

  buildDriversCheckBox() {
    console.log('3947r93')
    this.drivers.forEach((driver) => {
      this.driversCheckBoxList.push({
        info: driver, selected: this.checkIfPresent(driver.reference),
        disabled: this.isMainDriver(driver.reference)
      },)
    });
  }

  checkIfPresent(reference) {
    return this.assignedMatesReferences.includes(reference) || this.isMainDriver(reference);
  }

  isMainDriver(reference) {
    return reference === this.currentDriverReference;
  }

  onUpdateMainDriver() {
    const driverReference = this.getSelectedDriverReference();
    this.bookingService.updateBookingAssignedDriver(this.bookingReference, driverReference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
        if (data.updateBookingAssignedDriver.isInError)
        {
          this.showErrorText = true
          this.errorText = data.updateBookingAssignedDriver.errorMessage
        } else
        {
          location.reload();
        }
      },
      error => { console.log(error); }
    );
  }

  onUpdateMates() {
    const selected = this.driversCheckBoxList.filter((u: any) => u.selected && !u.disabled);
    const selectedReference = selected.map((item) => { return item.info.reference});
    this.bookingService.updateMates(this.bookingReference, selectedReference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data.updateMates.isInError)
        {
          this.showErrorText = true
          this.errorText = result.data.updateMates.errorMessage
        } else
        {
          location.reload();
        }
        },
        error: (error) => {
          console.log(error.message)
          console.log(error);
          this.showErrorText = true;
          this.errorText = `Update Drivers failed: Please contact system support`;
          this.spinner.hide();
        }
      })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
