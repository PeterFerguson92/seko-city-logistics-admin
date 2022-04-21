import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AddShipmentComponent, ShipmentsComponent],
  imports: [CommonModule, SharedModule]
})
export class ShipmentModule { }
