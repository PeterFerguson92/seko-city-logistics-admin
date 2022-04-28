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
    const shipmentReference = route.paramMap.get('reference');
    if (!shipmentReference)
    {
      const message = `shipment reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }
    console.log(shipmentReference)
    return this.bookingService.filterBookings({name: 'shipmentReference', value: shipmentReference})
      .pipe(map(data => data.data.filterBookings));
      // .pipe(map(data => console.log(data)));

  }
}
