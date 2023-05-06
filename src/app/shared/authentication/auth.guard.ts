import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService) {}

    async canActivate() {
        const key = localStorage.getItem('key');
        if (key) {
            const authResponse = await this.authService.isUserAuthenticated(key);
            if (authResponse.result) {
                return true;
            } else {
                this.redirectToLogin();
            }
        } else {
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        this.router.navigate(['/login']);
    }
}
