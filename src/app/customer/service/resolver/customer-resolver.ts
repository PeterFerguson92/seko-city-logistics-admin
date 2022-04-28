import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable, of } from 'rxjs';
import { ICustomer } from '../../model';
import { CustomersService } from '../customers.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<ICustomer> {

  constructor(private customersService: CustomersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    if (!reference) {
      const message = `reference was not a found: ${id}`;
      return of({ customer: null, error: message });
    }
    return this.customersService.getCustomerByReference(reference)
                .pipe(map(data => data.data.customerByReference));
  }
}
