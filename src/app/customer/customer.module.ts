import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { AddEditCustomerDialogComponent } from './add-edit-customer-dialog/add-edit-customer-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [CustomersComponent, CustomerDetailComponent, AddEditCustomerDialogComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule]
})
export class CustomerModule { }
