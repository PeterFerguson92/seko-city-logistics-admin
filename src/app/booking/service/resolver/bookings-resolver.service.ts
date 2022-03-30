import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { Observable, of, map, forkJoin, catchError } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsResolverService implements Resolve<IBooking>  {

  constructor(private bookingsService: BookingsService, private customersService: CustomersService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const reference = route.paramMap.get('reference');
    const sreference = route.paramMap.get('senderReference');
    console.log(sreference);
    if (!reference)
    {
      const message = `reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }

    const call1 = this.bookingsService.getBookingByReference(reference);
    const call2 = this.customersService.getCustomerByReference(sreference);
    return forkJoin([call1, call2])
  }
}
