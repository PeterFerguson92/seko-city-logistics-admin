import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { CommonService } from 'src/app/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<any> {
  constructor(private commonService: CommonService, private authService: AuthenticationService) { }


  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
  //   const sub = this.authService.getAuthSub();
  //   if (!sub)
  //   {
  //     const message = `user sub not found`;
  //     return of({ data: null, isInError: true, errorMsg: message });
  //   }
  //   return this.authService.getUser(sub)
  //     .pipe(
  //       map(data => ({ data: data.data.getUser, isInError: false, errorMsg: null })),
  //       catchError(error => {
  //         const message = `Retrieval error: ${error.errorMessage}`;
  //         return of({ data: null, isInError: true, errorMsg: message });
  //       }));
  }
}
