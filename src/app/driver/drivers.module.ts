import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { DriversComponent } from './drivers/drivers.component';
import { AddEditDriverComponent } from './add-edit-driver/add-edit-driver.component';

@NgModule({
  declarations: [DriversComponent, AddEditDriverComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule],

})
export class DriversModule { }
