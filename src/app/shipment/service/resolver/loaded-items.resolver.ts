import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { ItemService } from 'src/app/booking/service/items/item.service';
import { ShipmentService } from '../shipment.service';

@Injectable({
  providedIn: 'root'
})
export class LoadedItemsResolver implements Resolve<any> {

  constructor(private itemService: ItemService, private shipmentService: ShipmentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const call1 = this.itemService.getEligibleItems();
    const call2 = this.shipmentService.getShipments();
    return forkJoin([call1, call2]);
  }
}
