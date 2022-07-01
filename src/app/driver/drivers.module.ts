import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { DriversComponent } from './drivers/drivers.component';

@NgModule({
  declarations: [DriversComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule],

})
export class DriversModule { }
