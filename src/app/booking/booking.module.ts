import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerModule } from 'src/app/customer/customer.module';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AddEditBookingComponent } from './add-edit-booking/add-edit-booking.component';
import { BookingItemsComponent } from './booking-items/booking-items.component';
import { BookingInfoComponent } from './booking-info/booking-info.component';
import { BookingReviewComponent } from './booking-review/booking-review.component';

@NgModule({
  declarations: [BookingDetailComponent, AddEditBookingComponent, BookingItemsComponent, BookingInfoComponent, BookingReviewComponent],
  imports: [CommonModule, SharedModule, CustomerModule]
})
export class BookingModule { }
