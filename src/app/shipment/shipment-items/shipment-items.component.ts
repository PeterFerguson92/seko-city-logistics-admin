import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ItemService } from 'src/app/items/item.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-shipment-items',
  templateUrl: './shipment-items.component.html',
  styleUrls: [
    './shipment-items.component.css',
    '../../shared/shared-table.css',
    '../../shared/common.css']
})
export class ShipmentItemsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['SELECT', 'SENDER NAME', 'DESTINATION',
    'TYPE', 'DESCRIPTION', 'VALUE', 'AMOUNT', 'ACTION'];
  items = null;
  dataSource;
  isAllSelected = false;
  isError = false;
  errorMsg = null;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private itemService: ItemService) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const shipmentReference = snapshot.paramMap.get('reference');
    this.getItems(shipmentReference);
  }

  getItems(shipmentReference) {
    this.spinner.show();
    this.itemService.filteredFullItems({name: 'shipmentReference', value: shipmentReference})
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          const items = result.data.filteredFullItems;
          if (items.length > 0) {
            this.dataSource = new MatTableDataSource(this.buildItemsData(items))
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else
          {
            this.dataSource = new MatTableDataSource(null);
            this.errorMsg = `No records found`
            this.isError = true;
          }
          this.spinner.hide()
        },
        error: () => {
          this.errorMsg = `Sorry couldn't retrieve items`
          this.isError = true;
          this.spinner.hide()
        }
      })
  }

  onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

  onUnassignItem(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '25%',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
       this.itemService.updateItem(id, { name: 'shipmentReference', value: null }).subscribe(
      ({ data }) => {
        location.reload();  // TODO handle properly
      },
      error => {
        console.log(error);
      }
    )
      }
    })
  }

  onUnassignItems() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '25%',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        const itemsIdsToUnAssign = [];
        this.dataSource.data.forEach(row => {
        if (row.selected)
          {
          itemsIdsToUnAssign.push(row.itemId);
          }
        });
        this.unAssignItems(itemsIdsToUnAssign);
      }
    })
  }

  unAssignItems(itemsIdsToUnAssign) {
    const fieldToUpdate = { name: 'shipmentReference', value: null };
    this.itemService.updateItemsById(itemsIdsToUnAssign, fieldToUpdate).subscribe(
      ({ data }) => {
        location.reload();  // TODO handle properly
      },
      error => {
        console.log(error);
      }
    )
  }

  buildItemsData(results) {
    const resultData = []
    for (const result of results) {
      resultData.push(this.mergeData(result.item, result.booking))
    }
    return resultData;
  }

 mergeData(item, booking) {
  const itemCopy = { ...item };
  // tslint:disable-next-line:no-string-literal
  itemCopy['itemId'] = item.id
  return { ...itemCopy, ...booking };
 }

 selectAll() {
  if (this.dataSource && this.dataSource.data)
  {
    this.isAllSelected = !this.isAllSelected
    this.dataSource = new MatTableDataSource(this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected })));
  }
}

 isMultipleEnabled() {
  return this.dataSource && this.dataSource.data && this.dataSource.data.filter((u: any) => u.selected).length > 0;
 }

 isAllChecked() {
   const result =  this.dataSource && this.dataSource.data &&
     this.dataSource.data.filter((u: any) => u.selected).length === this.dataSource.data.length ;
   this.isAllSelected = result;
   return result
 }

selectElement(element) {
  element.selected = !element.selected;
}

ngOnDestroy() {
  this.componentDestroyed$.next(true)
  this.componentDestroyed$.complete()
}

}
