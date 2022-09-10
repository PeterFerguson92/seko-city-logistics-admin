import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  LOGIN_URL = '/login';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate(url) {
    localStorage.removeItem('id');
    if (this.LOGIN_URL === url)
    {
      localStorage.removeItem('foo')
    }
    this.router.navigateByUrl(url)
  }

}
