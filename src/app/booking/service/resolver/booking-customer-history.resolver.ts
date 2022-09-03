import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { BookingsService } from '../bookings/bookings.service';

@Injectable({
  providedIn: 'root'
})
export class BookingCustomerHistoryResolver implements Resolve<boolean> {

  constructor(private bookingsService: BookingsService) { }


  resolve(route: ActivatedRouteSnapshot): any {
    const senderReference = route.paramMap.get('senderReference');
    if (!senderReference)
    {
      const message = `bookings for sender reference was not found: ${senderReference}`;
      return of({ data: null, isInError: true, errorMsg: message });
    }
    return this.bookingsService.getBookingsBySender(senderReference)
      .pipe(
        map(data => ({ data: data.data.bookingsBySender, isInError: false, errorMsg: null })),
        catchError(error => {
          const message = `Retrieval error: ${error.errorMessage}`;
          return of({ data: null, isInError: true, errorMsg: message });
        }));
  }
}
