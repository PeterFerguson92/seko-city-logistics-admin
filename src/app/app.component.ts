import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav! : MatSidenav;
  isVisible = true;
  LOGIN_URL = '/login'

  constructor(private router: Router, route: Router) {

    route.events.subscribe(event => {
      if (this.sidenav)
      {
        this.sidenav.close();
      }
      // this.sidenav.open()
      if (event instanceof RoutesRecognized) {
        this.isVisible = event.url !== this.LOGIN_URL && event.url !== '/';
      }
      else if (event instanceof NavigationEnd)
      {
        this.isVisible = event.url !== this.LOGIN_URL && event.url !== '/';
        if (this.isVisible)
        {
         if (this.sidenav) { this.sidenav.toggle() };
        }
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

  onLogout() {
    localStorage.removeItem('id');
    localStorage.removeItem('foo')
    this.router.navigateByUrl('/login');
  }

}
