import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.loadDrivers();
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

  onSubmit() {
    this.spinner.show()
    const driverReference = this.getSelectedDriverReference();
    this.orderService.updateOrderAssignedDriver(this.data.reference, driverReference)
      .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (result) => {
            if (result.data && result.data.updateOrderAssignedDriver.isInError){
              this.showErrorText = true
              this.errorText = result.data.updateOrderAssignedDriver.errorMessage
            } else {
              location.reload();
            }
            this.spinner.hide()
          },
          error: () => {
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
