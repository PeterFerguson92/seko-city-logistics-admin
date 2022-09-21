import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-assign-multiple-bookings',
  templateUrl: './assign-multiple-bookings.component.html',
  styleUrls: ['./assign-multiple-bookings.component.css', '../../shared/shared-table.css','../../shared/shared-new-form.css']
})
export class AssignMultipleBookingsComponent implements OnInit, OnDestroy  {

  selectionForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  bookings;
  includeArchive = true;
  dataSource = null;
  displayedColumns: string[] = ['SELECT', 'ID', 'SENDER', 'DESTINATION', 'POSTCODE','DRIVER', 'ACTION'];
  currentDriver;
  drivers;
  driversUsername;
  currentDriverReference;
  bookingReference;
  errorText;
  isAllSelected = false;


  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private bookingsService: BookingsService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.selectionForm = this.formBuilder.group({
      date: [new Date('2022-09-19T00:00:00.000Z'), [Validators.required]],
      selectedDriverUsername: [''],
    })
    this.spinner.show();
    this.getDriversInfo();
    this.onLoadBookings();
  }

  getFormControl(fControlName: string) {
    return this.selectionForm.get(fControlName)
  }

  async getDriversInfo() {
    this.drivers = (await lastValueFrom(this.authService.getDrivers())).data.getDrivers.users;
    this.driversUsername = this.getDriversUsername();
    this.getCurrentDriverUsername(this.currentDriverReference);
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
          this.getFormControl('selectedDriverUsername').setValue(this.drivers[i].username);
        }
      }
    }
  }

  onLoadBookings() {
    const date = this.commonService.getFormattedIsoDate(this.getFormControl('date').value)
    this.bookingsService.filterBookings({ name: 'pickUpDate', value: date })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
          this.bookings = data.filterBookings;
          const newData = this.bookings.map((item, index) => Object.assign({}, item, { selected: false, index }));
          this.dataSource =  new MatTableDataSource(newData)
          console.log(this.bookings)
      },
      error => {
        console.log(error);
      }
    );
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    if (fControlName === 'selectedDriverUsername')
    {
      this.currentDriverReference = this.getDriverReference(fControl.value);
      console.log(this.currentDriverReference)
    }
  }

  getDriverReference(username) {
    let reference;
    if (this.drivers)
    {
      for (const driver of this.drivers)
      {
        if (driver.username === username)
        {
          reference = driver.reference;
        }
      }
      return reference;
    } else
    {
      return 'N/A'
    }
  }


  getDriverUsername(assignedDriverReference) {
    let username;
    if (this.drivers)
    {
      for (const driver of this.drivers)
      {
        if (driver.reference === assignedDriverReference)
        {
          username = driver.username;
        }
      }
      return username;
    } else
    {
      return 'N/A'
    }

  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  isDisabled() {
    return false;
  }

  selectAll() {
    if (this.dataSource && this.dataSource.data)
    {
      this.isAllSelected = !this.isAllSelected
      this.dataSource = new MatTableDataSource(this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected })));
    }
  }

  isAllChecked() {
    const result =  this.dataSource && this.dataSource.data &&
      this.dataSource.data.filter((u: any) => u.selected).length === this.dataSource.data.length ;
    this.isAllSelected = result;
    return result
  }

  onAssign() {
    const selectedBookings = this.dataSource.data.filter((u: any) => u.selected);
    const selectedBookingsReference = selectedBookings.map(a => a.reference);

    const fieldToUpdate = { name: 'assignedDriverReference', value: this.currentDriverReference };
    this.bookingsService.updateBookingsByReferences(selectedBookingsReference, fieldToUpdate).subscribe(
      ({ data }) => {
        location.reload();
      },
      error => {
        console.log(error);
      }
    )
  }


  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
