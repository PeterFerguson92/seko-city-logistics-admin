import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable, of } from 'rxjs';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings.service';

@Injectable({
  providedIn: 'root'
})
export class AssignBookingsResolver implements Resolve<IBooking> {

  constructor(private bookingService: BookingsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.bookingService.filterBookings({name: 'status', value: 'SHIPPED'})
      .pipe(map(data => data.data.filterBookings));
      // .pipe(map(data => console.log(data)));

  }
}
