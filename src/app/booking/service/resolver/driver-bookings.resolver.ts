import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings/bookings.service';

@Injectable({
  providedIn: 'root'
})
export class DriverBookingsResolver implements Resolve<IBooking> {
  constructor(private bookingService: BookingsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `driver reference was not a found`;
      return of({ bookings: null, error: message });
    }
    return this.bookingService.filterBookings({name: 'assignedDriverReference', value: reference})
      .pipe(map(data => data.data.filterBookings));
      // .pipe(map(data => console.log(data)));
  }
}
