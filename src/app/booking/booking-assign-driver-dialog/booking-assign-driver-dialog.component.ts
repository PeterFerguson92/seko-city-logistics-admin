import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-booking-assign-driver-dialog',
  templateUrl: './booking-assign-driver-dialog.component.html',
  styleUrls: ['./booking-assign-driver-dialog.component.css', '../../shared/shared.dialog.css']
})
export class BookingAssignDriverDialogComponent implements OnInit {
  assignDriverForm: FormGroup;
  currentDriver;
  drivers;
  driversUsername;

  constructor(private formBuilder: FormBuilder,
    private bookingService: BookingsService,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.getDriversInfo();
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

  async getDriversInfo() {
    this.drivers = (await lastValueFrom(this.authService.getDrivers())).data.getDrivers.users;
    this.driversUsername = this.getDriversUsername()
    this.getCurrentDriverUsername(this.data.driverReference)
  }

  getDriversUsername() {
    return this.drivers ? this.drivers.map(a => a.userName) : [];
  }

  getCurrentDriverUsername(reference) {
    if (this.drivers)
    {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.drivers.length; i++) {
        if (this.drivers[i].reference === reference)
        {
          this.getFormControl('currentDriverUsername').setValue(this.drivers[i].userName);
        }
      }
    } else {
        console.log(3737)
     }
  }

  getSelectedDriverReference() {
    let reference;
    const selectedDriverUsername = this.getFormControl('selectedDriverUsername').value;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.drivers.length; i++) {
      if (this.drivers[i].userName === selectedDriverUsername)
      {
        reference = this.drivers[i].reference;
      }
    }
    return reference;
  }

  onSubmit() {
    const reference = this.getSelectedDriverReference();
    const updateFields = [{ name: 'assignedDriverReference', value: reference }];
      this.bookingService.updateBooking(this.data.reference, updateFields).subscribe(
        ({ data }) => { location.reload()},
        error => { console.log(error);}
      );
  }

}
