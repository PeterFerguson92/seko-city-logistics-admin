import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { map, of } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings/bookings.service';

@Injectable({
  providedIn: 'root'
})
export class BookingSummaryResolver implements Resolve<IBooking>  {

  booking;
  constructor(private bookingsService: BookingsService, private customersService: CustomersService) { }

  resolve(route: ActivatedRouteSnapshot): any {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `booking reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }
     return this.bookingsService.getBookingByReference(reference)
      .pipe(map(data => data.data.bookingByReference));
  }
}
