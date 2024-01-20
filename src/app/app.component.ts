import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
// import rg4js from 'raygun4js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
    @ViewChild(MatSidenav, { static: true })
    sidenav!: MatSidenav;
    isVisible = true;
    LOGIN_URL = '/login';

    constructor(private router: Router, route: Router) {
        if (this.sidenav) {
            this.sidenav.open();
        }
        route.events.subscribe((event) => {
            // if (this.sidenav)
            // {
            //   this.sidenav.close();
            // }

            // rg4js('trackEvent', {
            //     type: 'pageView',
            //     path: event
            // });
            if (event instanceof RoutesRecognized) {
                this.isVisible = event.url !== this.LOGIN_URL && event.url !== '/';
            } else if (event instanceof NavigationEnd) {
                this.isVisible = event.url !== this.LOGIN_URL && event.url !== '/';
            }
        });
    }

    closeDropdown() {
        this.sidenav.close();
    }

    ngAfterViewInit(): void {
        // this.observer.observe(['(max-width: 800px)']).subscribe((res)=>{
        //   if(res.matches){
        //     this.sidenav.mode ='over';
        //     this.sidenav.close()
        //   }
        //   else{
        //     this.sidenav.mode = 'side';
        //     this.sidenav.open()
        //   }
        // })
    }

    onViewProfile() {
        this.router.navigateByUrl('/profile');
    }
}
