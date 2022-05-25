import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditShipmentComponent } from './add-edit-shipment/add-edit-shipment.component';
import { BookingModule } from '../booking/booking.module';
import { AssignItemsComponent } from './assign-items/assign-items.component';
import { ShipmentItemsComponent } from './shipment-items/shipment-items.component';

@NgModule({
  declarations: [AddEditShipmentComponent, ShipmentsComponent,
    AssignItemsComponent, ShipmentItemsComponent],
  imports: [CommonModule, SharedModule, BookingModule]
})
export class ShipmentModule { }
