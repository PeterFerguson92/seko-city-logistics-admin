import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable, of } from 'rxjs';
import { IShipment } from '../../model';
import { ShipmentService } from '../shipment.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsResolverService implements Resolve<IShipment> {

  constructor(private shipmentService: ShipmentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shipmentService.getShipments()
              .pipe(map(data => data.data.shipments));
  }
}
