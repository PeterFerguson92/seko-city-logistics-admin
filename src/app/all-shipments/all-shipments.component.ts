import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-all-shipments',
  templateUrl: './all-shipments.component.html',
  styleUrls: ['./all-shipments.component.css']
})
export class AllShipmentsComponent implements OnInit, OnDestroy, AfterViewInit {
   ELEMENT_DATA = [
    {id: 1, origin: 'Hydrogen', destination: 1.0079, date: 'H'},
    {id: 2, origin: 'Helium', destination: 4.0026, date: 'He'},
    {id: 3, origin: 'Lithium', destination: 6.941, date: 'Li'},
    {id: 4, origin: 'Beryllium', destination: 9.0122, date: 'Be'},
    {id: 5, origin: 'Boron', destination: 10.811, date: 'B'},
    {id: 6, origin: 'Carbon', destination: 12.0107, date: 'C'},
    {id: 7, origin: 'Nitrogen', destination: 14.0067, date: 'N'},
    {id: 8, origin: 'Oxygen', destination: 15.9994, date: 'O'},
    {id: 9, origin: 'Fluorine', destination: 18.9984, date: 'F'},
     { id: 10, origin: 'Neon', destination: 20.1797, date: 'Ne' },
     {id: 1, origin: 'Hydrogen', destination: 1.0079, date: 'H'},
     {id: 2, origin: 'Helium', destination: 4.0026, date: 'He'},
     {id: 3, origin: 'Lithium', destination: 6.941, date: 'Li'},
     {id: 4, origin: 'Beryllium', destination: 9.0122, date: 'Be'},
     {id: 5, origin: 'Boron', destination: 10.811, date: 'B'},
     {id: 6, origin: 'Carbon', destination: 12.0107, date: 'C'},
     {id: 7, origin: 'Nitrogen', destination: 14.0067, date: 'N'},
     {id: 8, origin: 'Oxygen', destination: 15.9994, date: 'O'},
     {id: 9, origin: 'Fluorine', destination: 18.9984, date: 'F'},
     {id: 10, origin: 'Neon', destination: 20.1797, date: 'Ne'}
   ];

  displayedColumns: string[] = ['id', 'origin', 'destination', 'date'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
