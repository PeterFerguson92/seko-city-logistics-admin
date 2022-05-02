import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable, of } from 'rxjs';
import { ShipmentService } from 'src/app/shipment/service/shipment.service';
import { IBooking } from '../../model';
import { BookingsService } from '../bookings/bookings.service';

@Injectable({
  providedIn: 'root'
})
export class AssignBookingsResolver implements Resolve<IBooking> {

  constructor(private bookingsService: BookingsService, private shipmentService: ShipmentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const call1 = this.bookingsService.filterBookings({name: 'status', value: 'SHIPPED'});
    const call2 = this.shipmentService.getShipments();
    return forkJoin([call1, call2])

    // return this.bookingService.filterBookings({name: 'status', value: 'SHIPPED'})
    //   .pipe(map(data => data.data.filterBookings));
    //   // .pipe(map(data => console.log(data)));
  }
}
