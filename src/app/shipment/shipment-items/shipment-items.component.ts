import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/booking/service/items/item.service';

@Component({
  selector: 'app-shipment-items',
  templateUrl: './shipment-items.component.html',
  styleUrls: ['./shipment-items.component.css', '../../shared/shared-table.css']
})
export class ShipmentItemsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['BOOKING REFERENCE', 'TYPE', 'DESCRIPTION', 'VALUE',
    'QUANTITY', 'PRICE PER UNIT', 'AMOUNT', 'ACTION'];
  items = null;
  dataSource = null;


  constructor(private router: Router,private activatedroute: ActivatedRoute,
  private itemService: ItemService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.items = data.items;
      this.dataSource = new MatTableDataSource(data.items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

  onUnassignItem(id) {
    this.itemService.updateItem(id, { name: 'shipmentReference', value: null }).subscribe(
      ({ data }) => {
        location.reload();  // TODO handle properly
      },
      error => {
        console.log(error);
      }
    )
  }

}
