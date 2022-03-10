import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddBookingComponent } from '../add-booking/add-booking.component';



@NgModule({
  declarations: [AddBookingComponent],
  imports: [CommonModule, SharedModule]
})
export class BookingModule { }
