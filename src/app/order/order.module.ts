import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { CustomerModule } from '../customer/customer.module';

@NgModule({
  declarations: [
    AddEditOrderComponent
  ],
  imports: [CommonModule,SharedModule, FlexLayoutModule,CustomerModule]
})
export class OrderModule { }
