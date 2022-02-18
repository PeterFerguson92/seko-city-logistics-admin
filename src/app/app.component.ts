import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { EventEmitterService } from './shared/service/event/event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isVisible = true;
  LOGIN_URL = '/login'

  constructor(route: Router) {
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

}
