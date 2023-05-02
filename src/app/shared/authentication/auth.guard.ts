import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService) {}

    canActivate() {
        const id = localStorage.getItem('id');
        if (id) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
        // return this.authService.isUserAuthenticated(localStorage.getItem('sub'));;
    }
}
