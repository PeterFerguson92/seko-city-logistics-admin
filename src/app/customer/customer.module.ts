import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceiverComponent } from './receiver/receiver.component';
import { CustomerBookingHistoryComponent } from './customer-booking-history/customer-booking-history.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [CustomersComponent, CustomerDetailComponent,ReceiverComponent, CustomerBookingHistoryComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule, NgxChartsModule],
  exports: [CustomerDetailComponent, ReceiverComponent]
})
export class CustomerModule { }
