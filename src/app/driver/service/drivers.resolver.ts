import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DriversResolver implements Resolve<boolean> {
  constructor(private authService: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.authService.getDrivers()
                .pipe(map(data => data.data.getDrivers.users));
  }
}
