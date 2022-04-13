import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerModule } from 'src/app/customer/customer.module';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AddEditBookingComponent } from './add-edit-booking/add-edit-booking.component';
import { BookingItemsComponent } from './booking-items/booking-items.component';
import { BookingInfoComponent } from './booking-info/booking-info.component';
import { BookingReviewComponent } from './booking-review/booking-review.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingsTableComponent } from './bookings-table/bookings-table.component';
import { AvailabilityDialogComponent } from './availability-dialog/availability-dialog.component';

@NgModule({
  declarations: [BookingDetailComponent, AddEditBookingComponent,
    BookingItemsComponent, BookingInfoComponent, BookingReviewComponent, BookingsComponent, BookingsTableComponent,
    AvailabilityDialogComponent],
  imports: [CommonModule, SharedModule, CustomerModule]
})
export class BookingModule { }
