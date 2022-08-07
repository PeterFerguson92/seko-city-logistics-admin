import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css', '../../shared/shared-table.css', '../../shared/shared-new-form.css']
})
export class DriversComponent implements OnInit {

  drivers;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = null;

  displayedColumns: string[] = ['ID', 'NAME', 'SURNAME', 'USERNAME', 'EMAIL', 'PHONE', 'COUNTRY', 'ACTION'];
  constructor(private authService: AuthenticationService,
    private router: Router, private dialog: MatDialog, private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.drivers);
    });
  }

  onAddDriver() {
    this.router.navigate(['/add-driver'])
  }

  onEditDriver(reference) {
    this.router.navigate(['/edit-driver', reference])
  }
  onShowBookingLocations(reference) {
    this.router.navigate(['/locations', reference])
  }

  onShowAssignedBookings(reference) {
    this.router.navigate(['/assignedBookings', reference])
  }

  onFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onDeleteDriver(username) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.authService.deleteUser(username).subscribe(
          ({ data }) => {
            location.reload();  // To handle properly
          },
          error => {
            console.log(error);
          }
        );
      }
    })
  }
}
