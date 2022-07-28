import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { DriversComponent } from './drivers/drivers.component';
import { AddEditDriverComponent } from './add-edit-driver/add-edit-driver.component';
import { DriverBookingsComponent } from './driver-bookings/driver-bookings.component';
import { DriverBookingsNotFoundComponent } from './driver-bookings-not-found/driver-bookings-not-found.component';
import { DriverBookingsLocationsComponent } from './driver-bookings-locations/driver-bookings-locations.component';

@NgModule({
  declarations: [DriversComponent, AddEditDriverComponent,DriverBookingsComponent,
    DriverBookingsNotFoundComponent, DriverBookingsLocationsComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule],

})
export class DriversModule { }
