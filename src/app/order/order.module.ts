import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { OrderReviewComponent } from './order-review/order-review.component';

@NgModule({
  declarations: [
    AddEditOrderComponent,
    OrderDetailComponent,
    OrderInfoComponent,
    OrderReviewComponent
  ],
  imports: [CommonModule,SharedModule, FlexLayoutModule,CustomerModule]
})
export class OrderModule { }
