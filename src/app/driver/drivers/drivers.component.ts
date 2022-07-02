import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css', '../../shared/shared-table.css']
})
export class DriversComponent implements OnInit {

  drivers;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = null;

  displayedColumns: string[] = ['ID', 'NAME', 'SURNAME', 'USERNAME', 'EMAIL', 'PHONE', 'COUNTRY', 'ACTION'];
  constructor(private authService: AuthenticationService, private router: Router,) { }

  ngOnInit(): void {
    this.authService.getDrivers().subscribe(
      ({ data }) => { console.log(data);  this.dataSource = new MatTableDataSource(data.getDrivers.users);},
      error => { console.log(error); }
    );
  }

  addDriver() {
    this.router.navigate(['/add-driver'])

  }

}