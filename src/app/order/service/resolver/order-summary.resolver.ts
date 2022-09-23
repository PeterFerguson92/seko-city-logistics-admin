import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { OrderService } from '../order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderSummaryResolver implements Resolve<boolean> {
  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot): any {
    const reference = route.paramMap.get('reference');
    if (!reference)
    {
      const message = `order with reference ${reference} was not found: `;
      return of({ data: null, isInError: true, errorMsg: message, reference: null });
    }
    return this.orderService.getOrderByReference(reference)
      .pipe(
        map(data => ({
          order: data.data.orderByReference, isInError: data.data.orderByReference === null ? true: false, errorMsg: null,
          reference
        })),
        catchError(error => {
          const message = `Retrieval error: ${error.errorMessage}`;
          return of({ order: null, isInError: true, errorMsg: message, reference: null });
        }));
  }
}
