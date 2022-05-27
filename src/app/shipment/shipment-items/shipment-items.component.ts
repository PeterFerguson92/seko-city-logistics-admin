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
  displayedColumns: string[] = ['SENDER NAME', 'DESTINATION', 'TYPE', 'DESCRIPTION', 'VALUE',
    'AMOUNT', 'ACTION'];
  items = null;
  dataSource = null;


  constructor(private router: Router,private activatedroute: ActivatedRoute,
  private itemService: ItemService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      // this.items = data.items;
      console.log(data)
      const items = data.items;
      this.dataSource = items.length > 0 ?
        new MatTableDataSource(this.buildItemsData(items)) : new MatTableDataSource(null); this.dataSource.paginator = this.paginator;
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

  buildItemsData(results) {
    const resultData = []
    for (const result of results) {
      resultData.push(this.mergeData(result.item, result.booking))
    }
    return resultData;
  }

 mergeData(item, booking) {
    return { ...item, ...booking };
  }

}
