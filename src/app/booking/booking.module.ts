import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerModule } from 'src/app/customer/customer.module';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AddEditBookingComponent } from './add-edit-booking/add-edit-booking.component';
import { BookingItemsComponent } from './booking-items/booking-items.component';

@NgModule({
  declarations: [BookingDetailComponent, AddEditBookingComponent, BookingItemsComponent],
  imports: [CommonModule, SharedModule, CustomerModule]
})
export class BookingModule { }
