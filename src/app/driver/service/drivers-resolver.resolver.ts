import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DriversResolverResolver implements Resolve<boolean> {
  constructor(private authService: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const reference = route.paramMap.get('reference');
    if (!reference) {
      const message = `reference was not a found: ${reference}`;
      return of({ customer: null, error: message });
    }
    return this.authService.getDrivers()
                .pipe(map(data => data.data));
  }
}
