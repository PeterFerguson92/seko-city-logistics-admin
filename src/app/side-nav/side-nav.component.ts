import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication/authentication.service';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
    LOGIN_URL = '/login';

    constructor(private router: Router, private authService: AuthenticationService) {}

    ngOnInit() {}

    navigate(url) {
        this.router.navigateByUrl(url);
    }

    async onLogout() {
        const key = localStorage.getItem('key');
        if (key) {
            const authResponse = await this.authService.logout(key);
            if (authResponse.result) {
                localStorage.removeItem('id');
                localStorage.removeItem('key');
                localStorage.removeItem('foo');
                this.router.navigateByUrl('/login');
            }
        }
    }
}
