import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { BreakpointObserver} from '@angular/cdk/layout'
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

  constructor(route: Router, private observer : BreakpointObserver) {
    route.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.isVisible = event.url !== this.LOGIN_URL;
      }
      else if (event instanceof NavigationEnd)
      {
        this.isVisible = event.url !== this.LOGIN_URL;
      }
    });
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res)=>{
      if(res.matches){
        this.sidenav.mode ='over';
        this.sidenav.close()
      }
      else{
        this.sidenav.mode = 'side';
        this.sidenav.open()
      }
    })
  }

}
