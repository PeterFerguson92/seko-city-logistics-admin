import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { forkJoin, map, Observable, of } from 'rxjs';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderResolver implements Resolve<boolean> {
  constructor(private orderService: OrderService, private customersService: CustomersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    const customerReference = route.paramMap.get('customerReference');
    if (!reference)
    {
      const message = `reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }

    const call1 = this.orderService.getOrderByReference(reference);
    return forkJoin([call1])
  }
}
