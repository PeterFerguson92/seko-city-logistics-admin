import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: [
        './drivers.component.css',
        '../../shared/shared-table.css',
        '../../shared/shared-new-form.css',
        '../../shared/common.css',
    ],
})
export class DriversComponent implements OnInit, OnDestroy {
    drivers;
    isError = false;
    errorMsg = null;
    dataSource = null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['ID', 'NAME', 'SURNAME', 'USERNAME', 'EMAIL', 'PHONE', 'COUNTRY', 'ACTION'];

    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.spinner.show();
        this.authService
            .getDrivers()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    this.dataSource = new MatTableDataSource(result.data.getDrivers.users);
                    this.spinner.hide();
                },
                error: (error) => {
                    this.errorMsg = 'Something went wrong, please contact system support';
                    this.isError = true;
                    console.log(error.message);
                    console.log(error);
                    this.spinner.hide();
                },
            });
    }

    onAddDriver() {
        this.router.navigate(['/add-driver']);
    }

    onEditDriver(reference) {
        this.router.navigate(['/edit-driver', reference]);
    }

    onShowBookingLocations(reference) {
        this.router.navigate(['/locations', reference]);
    }

    onShowAssignedBookings(reference) {
        this.router.navigate(['/assignedBookings', reference]);
    }

    onAssignBookings() {
        this.router.navigate(['/assign-bookings']);
    }

    onAssignOrders() {
        this.router.navigate(['/assign-orders']);
    }

    onFilter(value: string) {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    onDeleteDriver(username) {
        const dialogRef = this.dialog.open(DialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'true') {
                this.authService.deleteUser(username).subscribe(
                    ({ data }) => {
                        this.spinner.show();
                        location.reload(); // To handle properly
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
            this.spinner.hide();
        });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
