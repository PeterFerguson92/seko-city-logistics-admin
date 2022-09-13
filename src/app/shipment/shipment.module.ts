import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentsComponent } from './shipments/shipments.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditShipmentComponent } from './add-edit-shipment/add-edit-shipment.component';
import { BookingModule } from '../booking/booking.module';
import { ShipmentItemsComponent } from './shipment-items/shipment-items.component';
import { ShipmentAnalysisComponent } from './shipment-analysis/shipment-analysis.component';
import { ShipmentReportComponent } from './shipment-report/shipment-report.component';
import { EligibleItemsComponent } from './eligible-items/eligible-items.component';

@NgModule({
  declarations: [AddEditShipmentComponent, ShipmentsComponent,
    ShipmentItemsComponent, ShipmentAnalysisComponent, ShipmentReportComponent, EligibleItemsComponent],
  imports: [CommonModule, SharedModule, BookingModule]
})
export class ShipmentModule { }
