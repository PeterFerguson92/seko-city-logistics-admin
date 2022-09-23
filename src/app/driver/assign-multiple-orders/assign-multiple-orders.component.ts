import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { OrderService } from 'src/app/order/service/order.service';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-assign-multiple-orders',
  templateUrl: './assign-multiple-orders.component.html',
  styleUrls: ['./assign-multiple-orders.component.css',
    '../../shared/shared-table.css',
    '../../shared/shared-new-form.css',
    '../../shared/common.css']
})
export class AssignMultipleOrdersComponent implements OnInit, OnDestroy  {

  orders
  drivers;
  errorText;
  currentDriver;
  driversUsername;
  orderReference;
  dataSource = null;
  isAllSelected = false;
  selectionForm: FormGroup;
  isButtonDisabled = true;
  currentDriverReference = null;
  componentDestroyed$: Subject<boolean> = new Subject();
  displayedColumns: string[] = ['SELECT', 'ID', 'CUSTOMER', 'DELIVERY DATE', 'DELIVERY POSTCODE','DRIVER'];

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
    private orderService: OrderService, private authService: AuthenticationService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.selectionForm = this.formBuilder.group({
      // date: [new Date('2022-09-15T00:00:00.000Z'), [Validators.required]],
      date: [new Date(), [Validators.required]],
      selectedDriverUsername: ['', [Validators.required]],
    })
    this.spinner.show();
    this.getDriversInfo();
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
      for (const driver of this.drivers)
      {
        if (driver === reference)
        {
          this.getFormControl('selectedDriverUsername').setValue(driver.username);
        }
      }
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

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  isDisabled() {
    const selectedOrders = this.dataSource && this.dataSource.data ?
      this.dataSource.data.filter((u: any) => u.selected) : [];
    return selectedOrders.length === 0 || this.currentDriverReference === null;
  }

  selectAll() {
    if (this.dataSource && this.dataSource.data)
    {
      this.isAllSelected = !this.isAllSelected
      this.dataSource = new MatTableDataSource(this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected })));
    }
  }

  isAllChecked() {
    const result =  this.dataSource && this.dataSource.data && this.dataSource.data.length > 0 &&
      this.dataSource.data.filter((u: any) => u.selected).length === this.dataSource.data.length ;
    this.isAllSelected = result;
    return result
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    if (fControlName === 'selectedDriverUsername')
    {
      this.currentDriverReference = this.getDriverReference(fControl.value);
    }
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onLoadOrders() {
    const date = this.commonService.getFormattedIsoDate(this.getFormControl('date').value)
    this.orderService.filterOrders({ name: 'deliveryDate', value: date })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
          this.orders = data.filterOrders;
          const newData = this.orders.map((item, index) => Object.assign({}, item,
            { selected: false, index }));
          this.dataSource =  new MatTableDataSource(newData)
      },
      error => {
        console.log(error);
      }
    );
  }

  onAssign() {
    const selectedOrders = this.dataSource.data.filter((u: any) => u.selected);
    const selectedOrdersReference = selectedOrders.map(a => a.reference);
    const fieldToUpdate = { name: 'assignedDriverReference', value: this.currentDriverReference };
    this.orderService.updateOrdersByReferences(selectedOrdersReference, fieldToUpdate).subscribe(
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
