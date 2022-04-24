import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable, of } from 'rxjs';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings.service';

@Injectable({
  providedIn: 'root'
})
export class AssignBookingsResolverService implements Resolve<IBooking> {

  constructor(private bookingService: BookingsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const shipmentReference = route.paramMap.get('reference');
    if (!shipmentReference)
    {
      const message = `shipment reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }
    return this.bookingService.getByStatusOrShipmentReference('CREATED', shipmentReference)
      .pipe(map(data => data.data.bookingsByStatusOrShipmentReference));
  }
}
