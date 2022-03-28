import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { Observable, of, map } from 'rxjs';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsResolverService implements Resolve<IBooking>  {

  constructor(private bookingsService: BookingsService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const reference = route.paramMap.get('reference');
    if (!reference) {
      const message = `reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }
    return this.bookingsService.getBookingByReference(reference)
                .pipe(map(data => data.data.bookingByReference));
  }
}
