import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SharedModule } from '../shared/shared.module';
import { AssignBookingsComponent } from '../booking/assign-bookings/assign-bookings.component';
import { AddEditShipmentComponent } from './add-edit-shipment/add-edit-shipment.component';
import { BookingModule } from '../booking/booking.module';
import { ListBookingsComponent } from './list-bookings/list-bookings.component';

@NgModule({
  declarations: [AddEditShipmentComponent, ShipmentsComponent, AssignBookingsComponent, ListBookingsComponent],
  imports: [CommonModule, SharedModule, BookingModule]
})
export class ShipmentModule { }
