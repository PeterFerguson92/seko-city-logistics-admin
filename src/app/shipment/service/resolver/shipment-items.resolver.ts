import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { ItemService } from 'src/app/booking/service/items/item.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentItemsResolver implements Resolve<boolean> {
  constructor(private itemService: ItemService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const shipmentReference = route.paramMap.get('reference');
    if (!shipmentReference)
    {
      const message = `shipment reference was not a found: ${shipmentReference}`;
      return of({ customer: null, error: message });
    }
    return this.itemService.getItemsByShipmentReference(shipmentReference)
      .pipe(map(data => data.data.itemsByShipmentReference));
      // .pipe(map(data => console.log(data)));

  }
}
