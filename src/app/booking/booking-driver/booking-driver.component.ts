import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-driver',
  templateUrl: './booking-driver.component.html',
  styleUrls: ['./booking-driver.component.css', '../../shared/shared-new-form.css']
})
export class BookingDriverComponent implements OnInit, OnDestroy {
  assignDriverForm: FormGroup;
  currentDriver;
  drivers;
  driversUsername;
  currentDriverReference;
  bookingReference;
  errorText;
  showErrorText = false;
  driversCheckBoxList = [];
  selectedMateReferences = [];
  assignedMatesReferences = [];

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private bookingService: BookingsService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(async data => {
      this.bookingReference = data.booking.reference;
      this.currentDriverReference = data.booking.assignedDriverReference;
      this.assignedMatesReferences = data.booking.assignedMatesReferences ?  data.booking.assignedMatesReferences : [];
      this.spinner.show();
      this.getDriversInfo();
      this.assignDriverForm = this.formBuilder.group({
        currentDriverUsername: [''],
        selectedDriverUsername: [''],
      })
      this.assignDriverForm.get('currentDriverUsername').disable();
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
    this.drivers = (await lastValueFrom(this.authService.getDrivers())).data.getDrivers.users;
    this.driversUsername = this.getDriversUsername();
    this.getCurrentDriverUsername(this.currentDriverReference);
    this.buildDriversCheckBox();
    this.spinner.hide();
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
      .subscribe(
      ({ data }) => {
        if (data.updateMates.isInError)
        {
          this.showErrorText = true
          this.errorText = data.updateMates.errorMessage
        } else
        {
          location.reload();
        }
      },
      error => { console.log(error); }
    );
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}