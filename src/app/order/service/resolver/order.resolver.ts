import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { OrderService } from '../order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderResolver implements Resolve<boolean> {
  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `order reference: ${reference} not found`;
      return of({ shipment: null, error: message });
    }
    return this.orderService.getOrderByReference(reference)
              .pipe(map(data => data.data.orderByReference));
  }
}
