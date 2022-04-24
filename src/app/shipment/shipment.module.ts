import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SharedModule } from '../shared/shared.module';
import { AssignBookingsComponent } from './assign-bookings/assign-bookings.component';

@NgModule({
  declarations: [AddShipmentComponent, ShipmentsComponent, AssignBookingsComponent],
  imports: [CommonModule, SharedModule]
})
export class ShipmentModule { }
