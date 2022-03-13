import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { AddEditCustomerDialogComponent } from './add-edit-customer-dialog/add-edit-customer-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceiverComponent } from './receiver/receiver.component';


@NgModule({
  declarations: [CustomersComponent, CustomerDetailComponent, AddEditCustomerDialogComponent, ReceiverComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule],
  exports: [CustomerDetailComponent, ReceiverComponent]
})
export class CustomerModule { }
