import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerBookingHistoryResolver implements Resolve<boolean> {
  constructor(private bookingsService: BookingsService) { }


  resolve(route: ActivatedRouteSnapshot): any {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `bookings for reference was not found: ${reference}`;
      return of({ data: null, isInError: true, errorMsg: message, reference: null });
    }
    return this.bookingsService.getBookingsBySender(reference)
      .pipe(
        map(data => ({
          data: data.data.bookingsBySender, isInError: false, errorMsg: null,
          reference
        })),
        catchError(error => {
          const message = `Retrieval error: ${error.errorMessage}`;
          return of({ data: null, isInError: true, errorMsg: message, reference: null });
        }));
  }
}
