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
import { PreviousRecvDialogComponent } from './previous-recv-dialog/previous-recv-dialog.component';
import { BookingsReceiversComponent } from './bookings-receivers/bookings-receivers.component';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { BookingUpdateDialogComponent } from './booking-update-dialog/booking-update-dialog.component';
import { ItemDuplicateDialogComponent } from './item-duplicate-dialog/item-duplicate-dialog.component';

@NgModule({
  declarations: [BookingDetailComponent, AddEditBookingComponent,
    BookingItemsComponent, BookingInfoComponent, BookingReviewComponent, BookingsComponent, BookingsTableComponent,
    AvailabilityDialogComponent,
    PreviousRecvDialogComponent,
    BookingsReceiversComponent,
    AssignDialogComponent,
    ItemsListComponent,
    BookingSummaryComponent,
    BookingUpdateDialogComponent,
    ItemDuplicateDialogComponent],
  imports: [CommonModule, SharedModule, CustomerModule],
  exports: [ItemsListComponent]
})
export class BookingModule { }
