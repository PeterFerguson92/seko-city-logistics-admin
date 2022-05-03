import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { IShipment } from '../../model';
import { ShipmentService } from '../shipment.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentResolver implements Resolve<IShipment> {
  constructor(private shipmentService: ShipmentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `shipment reference: ${reference} not found`;
      return of({ shipment: null, error: message });
    }
    return this.shipmentService.getShipmentByReference(reference)
      .pipe(map(data => data.data.shipmentByReference));
  }
}
