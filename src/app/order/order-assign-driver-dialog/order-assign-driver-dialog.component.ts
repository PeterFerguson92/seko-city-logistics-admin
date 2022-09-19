import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-assign-driver-dialog',
  templateUrl: './order-assign-driver-dialog.component.html',
  styleUrls: ['./order-assign-driver-dialog.component.css', '../../shared/shared.dialog.css']
})
export class OrderAssignDriverDialogComponent implements OnInit, OnDestroy {

  assignDriverForm: FormGroup;
  currentDriver;
  drivers;
  driversUsername;
  errorText;
  showErrorText = false;

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getDriversInfo();
    this.assignDriverForm = this.formBuilder.group({
      selectedDriverUsername: [''],
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
    this.getCurrentDriverUsername(this.data.assignedDriverReference);
    this.spinner.hide();

  }

  getDriversUsername() {
    return this.drivers ? this.drivers.map(a => a.username) : [];
  }

  getCurrentDriverUsername(reference) {
    if (this.drivers)
    {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.drivers.length; i++) {
        if (this.drivers[i].reference === reference)
        {
          this.getFormControl('selectedDriverUsername').setValue(this.drivers[i].username);
        }
      }
    }
  }

  getSelectedDriverReference() {
    let reference;
    const selectedDriverUsername = this.getFormControl('selectedDriverUsername').value;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.drivers.length; i++) {
      if (this.drivers[i].username === selectedDriverUsername)
      {
        reference = this.drivers[i].reference;
      }
    }
    return reference;
  }

  onSubmit() {
    const driverReference = this.getSelectedDriverReference();
    this.orderService.updateOrderAssignedDriver(this.data.reference, driverReference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
        if (data.updateOrderAssignedDriver.isInError)
        {
          this.showErrorText = true
          this.errorText = data.updateOrderAssignedDriver.errorMessage
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
