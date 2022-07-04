import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';

@Component({
  selector: 'app-booking-assign-driver-dialog',
  templateUrl: './booking-assign-driver-dialog.component.html',
  styleUrls: ['./booking-assign-driver-dialog.component.css']
})
export class BookingAssignDriverDialogComponent implements OnInit {
  assignDriverForm: FormGroup;
  currentDriver;
  drivers;
  driversList;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.getDrivers()
    this.currentDriver = this.getCurrentDriverUsername('DUK-11133')
      this.assignDriverForm = this.formBuilder.group({
        currentDriverName: [''],
        selectedDriverName: [''],
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

  async getDrivers() {
    this.drivers = (await lastValueFrom(this.authService.getDrivers())).data.getDrivers.users;
    this.driversList = this.getDriversUsername()
    // this.authService.getDrivers().subscribe(
    //   ({ data }) => { this.drivers = data.getDrivers.users },
    //   error => { console.log(error); }
    // );
  }

  getDriversUsername() {
    return this.drivers ? this.drivers.map(a => a.username) : []
  }

  getCurrentDriverUsername(reference) {
    console.log(reference)
    if (this.drivers)
    {
      const d = this.drivers.find(x => x.reference === reference);
      ;
      console.log(d[0])
      // this.getFormControl('currentDriverName').setValue(d[0])
    }
  }

  onUpdate() {
    // const updateFields = [{ name: 'status', value: this.getFormControl('status').value }];
    //   this.bookingService.updateBooking(this.data.booking.reference, updateFields).subscribe(
    //     ({ data }) => {
    //       location.reload();  // TODO handle properly
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }

}
