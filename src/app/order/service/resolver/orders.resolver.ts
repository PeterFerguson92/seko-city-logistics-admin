import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { OrderService } from '../order.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersResolver implements Resolve<boolean> {
  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.orderService.getOrders()
              .pipe(map(data => data.data.orders));
  }
}
